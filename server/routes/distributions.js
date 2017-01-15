var express = require('express');
var router = express.Router();
var contactService = require('../modules/contactService')
var pg = require('pg');

var config = require('../config')

var pool = new pg.Pool(config.pg)

var MAX_GET = 1000;

function buildQuery(query) {
  var param = 1;
  var result = {
    text: 'SELECT distributions.id as distribution_id, contacts.id as contact_id, * FROM distributions '+
    'JOIN contacts ON distributions.contact_id = contacts.id',
    values: []
  }

  if(query.contact_id) {
    result.text += ' WHERE contact_id = $' + param
    result.values.push(query.contact_id)
    param++
  } else if (query.org_type) {
    result.text += ' WHERE org_type = $' + param
    result.values.push(query.org_type)
    param++
  }

  if(query.start_date && query.end_date) {
    if(query.contact_id || query.org_type) {
      result.text += ' AND'
    } else {
      result.text += ' WHERE'
    }

    result.text += ' date >= $' + param
    param++
    result.text += ' AND date <= $' + param
    param++
    result.values.push(query.start_date, query.end_date)
  } else {
    result.text += ' LIMIT ' + MAX_GET
  }

  console.log('result', result);
  return result
}

function getDetails(distributions, client, res) {
  distributions.forEach(function(distribution) {
    client.query(
      'SELECT * FROM distribution_details '+
      'WHERE distribution_id = $1',
      [distribution.id]
    )
      .then(function(result) {
        distribution.categories = result.rows.reduce(function(total, current) {
          total[current.category_id] = current.amount;
          return total;
        }, {})
      });
  });

  client.on('drain', client.end.bind(client) )

  client.on('end', function() {
    res.send(distributions)
  });

  client.on('error', function(err) {
    res.status(500).send(err)
  });
}

//get all organizations
router.get('/organizations', function(req, res) {
  pool.connect()
    .then(function (client) {
      client.query(
        'SELECT * FROM distributions '+
        'WHERE organization_id IS NOT NULL'
      )
        .then(function(result) {
          getDetails(result.rows, client, res)
        })
        .catch(function(err) {
          console.log('GET organizations error: ', err);
          res.status(500).send(err)
        });
    })
});

//get all individuals
router.get('/individuals', function(req, res) {
  pool.connect()
    .then(function (client) {
      client.query(
        'SELECT * FROM distributions '+
        'WHERE organization_id IS NULL'
      )
        .then(function(result) {
          getDetails(result.rows, client, res)
        })
        .catch(function(err) {
          console.log('GET individuals error: ', err);
          res.status(500).send(err)
        });
    })
});

//get by date range
router.get('/', function (req, res) {
  pool.connect()
  .then(function(client) {
    var query = buildQuery(req.query)

    client.query(query)
    .then(function(result) {
      getDetails(result.rows, client, res)
    });
  });
});

router.delete('/:id', function(req, res) {
  pool.connect()
  .then(function(client) {
    client.query(
      'DELETE FROM distribution_details '+
      'WHERE distribution_id = $1',
      [req.params.id]
    )
    .then(function(result) {
      client.query(
        'DELETE FROM distributions '+
        'WHERE id = $1',
        [req.params.id]
      )
      .then(function(result) {
        client.release();
        res.sendStatus(200);
      })
      .catch(function(err) {
        console.log('DELETE distribution error: ', err);
        res.status(500).send(err);
      })
    })
    .catch(function(err) {
      console.log('DELETE distribution_details error: ', err);
      res.status(500).send(err)
    });
  });
});

router.use(contactService.find)
router.use(function (req, res, next) {
  // Contacts managed by admin
  if(req.body.org_type === 'sub_dist') {
    req.body.donor = false
    req.body.org = true
    next()
  } else {
    req.body.donor = false
    req.body.org = false

    contactService.upsert(req, res)
    .then(function (response) {
      req.body.contact_id = req.contact.id
      next()
    })
  }
})

router.post('/', function (req, res) {
  var distribution = req.body;

  console.log(req.user);
  pool.connect()
  .then(function(client) {
    client.query(
      'INSERT INTO distributions (contact_id, date, added_by, timestamp) '+
      'VALUES ($1, $2, $3, $4) '+
      'RETURNING id',
      [
        distribution.contact_id,
        distribution.timestamp,
        req.user.id,
        distribution.timestamp
      ]
    )
    .then(function(result) {
      var distribution_id = result.rows[0].id
      var categories = Object.keys(distribution.categories);

      categories.forEach(function(category) {
        client.query({
          text: 'INSERT INTO distribution_details (distribution_id, category_id, amount) '+
          'VALUES ($1, $2, $3)',
          values: [distribution_id, category, distribution.categories[category]],
          name: 'insert-distribution-details'
        })
      })

      client.on('drain', client.end.bind(client) )

      client.on('end', function() {
        res.sendStatus(200)
      })

      client.on('error', function(err) {
        res.status(500).send(err)
      })
    })
    .catch(function(err) {
      console.log('POST distributions error:' , err);
      res.status(500).send(err)
    });
  })
});

router.put('/', function(req, res) {
  var distribution = req.body
  pool.connect()
  .then(function(client) {
    var date = new Date();
    client.query(
      'UPDATE distributions '+
      'SET organization_id = $1, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
      'WHERE id = $6',
      [
        distribution.organization_id,
        distribution.timestamp,
        distribution.timestamp,
        req.user.id,
        date.toISOString(),
        distribution.distribution_id
      ]
    )
    .then(function(result) {
      var categories = Object.keys(distribution.categories);
      distribution.categories.forEach(function(category) {
        client.query({
          text: 'INSERT INTO distribution_details (distribution_id, category_id, amount) '+
          'VALUES ($1, $2, $3) '+
          'ON CONFLICT (distribution_id, category_id) DO UPDATE '+
          'SET amount = $3',
          values: [distribution_id, category, distribution.categories[category]],
          name: 'update-distribution-details'
        });
      });

    client.on('drain', client.end.bind(client))

    client.on('end', function() {
      res.sendStatus(200)
    });

    client.on('error', function(err) {
      console.log('UPDATE distribution detail error: ', err);
      res.status(500).send(err)
      });
    })
    .catch(function(err) {
      console.log('POST distribution error: ', err);
      res.status(500).send(err)
    });
  });
});

module.exports = router;
