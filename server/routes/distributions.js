var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

var MAX_GET = 1000;

function buildQuery(query) {
  var param = 1;
  var result = {
    text: 'SELECT distributions.id as distribution.id, contacts.id as contact.id, * FROM distributions '+
    'JOIN contacts ON distributions.contact.id = contacts.id',
    values: [];
  }

  console.log('query: ', query);

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

    result.text += ' WHERE date >= $' + param
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

//get all organizations
router.get('/organizations', function(req, res) {
  pool.query(
    'SELECT * FROM distributions '+
    'WHERE organization_id IS NOT NULL'
  )
  .then(function(result) {
    res.send(result.rows)
  });
  .catch(function(err) {
    console.log('GET organizations error: ', err);
    res.status(500).send(err)
  });
});

//get all individuals
router.get('/individuals', function(req, res) {
  pool.query(
    'SELECT * FROM distributions '+
    'WHERE organization_id IS NULL'
  )
  .then(function(result) {
    res.send(result.rows)
  });
  .catch(function(err) {
    console.log('GET individuals error: ', err);
    res.status(500).send(err)
  });
});

//get by date range
router.get('/', function (req, res) {
  pool.connect()
  .then(function(client) {
    var query = buildQuery(req.query)

    client.query(query)
    .then(function(result) {
      var distributions = result.rows

      distributions.forEach(function(distribution) {
        client.query(
          'SELECT * FROM distribution_details '+
          'WHERE distribution_id = $1',
          [distribution.distribution_id]
        )
        .then(function(result) {
          distribution.categories = result.rows
        });
      });

      client.on('drain', client.end.bind(client) )

      client.on('end', function() {
        res.send(distributions)
      });

      client.on('error', function(err) {
        res.status(500).send(err)
      });
    });
  });
});

router.post('/', function (req, res) {
  var distributor = req.body;

  pool.connect()
  .then(function(client) {
    client.query(
      'INSERT INTO distributions (contact_id, date, timestamp, added_by) '+
      'VALUES ($1, $2, $3, $4) '+
      'RETURNING id',
      [
        distributor.contact_id
        distributor.date,
        distributor.timestamp,
        distributor.added_by,
        req.user.id
      ]
    )
    .then(function(result) {
      var distribution_id = result.rows[0]

      distribution.categories.forEach(function(category) {
        client.query({
          text: 'INSERT INTO distribution_details (distribution_id, category_id, amount) '+
          'VALUES ($1, $2, $3)',
          values: [distribution_id, category.id, category.amount],
          nameL 'insert-distribution-details'
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
      console.log('POST distributons error:' , err);
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
      'SET contact_id, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
      'WHERE id = $6',
      [
        distribution.contact_id,
        distribution.timestamp,
        distribution.timestamp,
        req.user.id
        date.toISOString(),
        distribution.distribution_id
      ]
    )
    .then(function(result) {
      distribution.categories.forEach(function(category) {
        client.query({
          text: 'INSERT INTO distribution_details (distribution_id, category_id, amount) '+
          'VALUES ($1, $2, $3) '+
          'ON CONFLICT (distribution_id, category_id) DO UPDATE '+
          'SET amount = $3',
          values: [category.distribution_id, category.category_id, category.amount],
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
    });
    .catch(function(err) {
      console.log('POST distribution error: ', err);
      res.status(500).send(err)
    });
  });
});
