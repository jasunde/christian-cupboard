var express = require('express');
var router = express.Router();
var pgEscape = require('pg-escape');
var contactService = require('../modules/contactService');
var pg = require('pg');
var config = require('../config');

var pool = new pg.Pool(config.pg)

var MAX_GET = 1000

function buildQuery(query, categories) {
  var param = 1;
  var categoryList = ''
  categories.forEach(function (category, index) {
    categoryList += ' "' + pgEscape(category.name) + '" NUMERIC'
    if(index < categories.length - 1) {
      categoryList += ', '
    } 
  })
  var result = {
    text: `SELECT * FROM 
          crosstab(
          'SELECT donations.id AS donation_id, donations.contact_id AS contact_id, donations.timestamp AS timestamp, name, amount FROM donations 
          LEFT JOIN donation_details ON donations.id = donation_details.donation_id 
          LEFT JOIN categories ON categories.id = donation_details.category_id 
          ORDER BY 1,2', 
          'SELECT name FROM categories') 
          AS ct(donation_id INTEGER, contact_id INTEGER, timestamp TIMESTAMP, ${categoryList}) 
          LEFT JOIN contacts ON contacts.id = contact_id`,
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


  return result
}

//Takes care of getBy ContactID, getBYDateRange, and getByOrgType
router.get('/', function (req, res) {
  pool.connect()
  .then(function (client) {
    client.query(
      'SELECT * FROM categories'
    )
      .then(function (result) {
        var query = buildQuery(req.query, result.rows);
        // console.log(query);
               
        client.query(query)
        .then(function (result) {
          client.release()
          res.send(result.rows)
        })
        .catch(function (err) {
          console.log('GET donations error:', err)
          res.status(500).send(err)
        });
      })
      .catch(function (err) {
        console.log('GET categories error:', err)
        res.status(500).send(err)
      });
  });


});

// Get by ID
router.get('/id/:id', function (req, res) {
  pool.connect()
  .then(function (client) {
    client.query(
      'SELECT donations.id as donation_id, contacts.id as contact_id, * FROM donations '+
      'JOIN contacts ON donations.contact_id = contacts.id '+
      'WHERE donations.id = $1',
      [req.params.id]
    )
    .then(function (result) {
      var donation = result.rows[0]

      client.query(
        'SELECT * FROM donation_details '+
        'WHERE donation_id = $1',
        [donation.donation_id]
      )
      .then(function (result) {
        client.release()
        donation.categories = result.rows.reduce(function (total, current) {
          total[current.category_id] = parseFloat(current.amount);
          return total;
        }, {})
        res.send(donation)
      })
      .catch(function (err) {
        console.log('GET donation details by ID error:', err);
        res.status(500).send(err)
      })
    })
    .catch(function (err) {
      console.log('GET donation by ID error:', err);
      res.status(500).send(err)
    })
  })
})

router.delete('/:id', function (req, res) {
  pool.connect()
  .then(function (client) {
    client.query(
      'DELETE FROM donation_details '+
      'WHERE donation_id = $1',
      [req.params.id]
    )
    .then(function () {
      client.query(
        'DELETE FROM donations '+
        'WHERE id = $1',
        [req.params.id]
      )
      .then(function () {
        client.release();
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.log('DELETE donation error:', err)
        req.sendStatus(500)
      })
    })
    .catch(function (err) {
      console.log('DELETE donation_details error:', err)
      req.sendStatus(500)
    })
  })
})

router.use(contactService.find)
router.use(function (req, res, next) {
  // Contacts managed by admin
  if(req.contact) {
    if(req.contact.org_type === 'food_rescue') {
      next()
    } else {

      // Contacts not managed by admin
      contactService.upsert(req, res)
        .then(function (response) {
          req.body.contact_id = req.contact.id
          next()
        })
    }
  } else {
    req.body.donor = true;
    if(req.body.org_name) {
      req.body.org = true;
      req.body.org_type = donor;
    } else {
      req.body.org = false;
    }

    contactService.upsert(req, res)
      .then(function (response) {
        req.body.contact_id = req.contact.id
        next()
      })
  }
})

router.post('/', function (req, res) {
  var donation = req.body
  pool.connect()
  .then(function (client) {
    client.query(
      'INSERT INTO donations (contact_id, timestamp, date, added_by) '+
      'VALUES ($1, $2, $3, $4) '+
      'RETURNING id',
      [
        req.contact.id,
        donation.timestamp,
        donation.timestamp,
        req.user.id
      ]
    )
    .then(function (result) {
      var donation_id = result.rows[0].id

      var categories = Object.keys(donation.categories);

      var param = 1;

      var query = {
          text: 'INSERT INTO donation_details (donation_id, category_id, amount) '+
          'VALUES ',
          values: [],
          name: 'insert-donation-details'
        }

      categories.forEach(function (category, index) {
        query.text += '($' + (param++) +', $' + (param++) +', $' + (param++) +')'
        if(index < categories.length - 1) {
          query.text += ', '
        }
        query.values.push(donation_id, category, donation.categories[category])
      });

      console.log('details query', query);

        client.query(query)
        .then(function (response) {
          res.sendStatus(201)
        })
        .catch(function (err) {
          console.log('POST donation details error:', err);
          res.status(500).send(err)
        })
    })
    .catch(function (err) {
      console.log('POST donation error:', err)
      res.status(500).send(err)
    })
  })
})

router.put('/', function (req, res) {
  var donation = req.body
  // console.log(donation);
  pool.connect()
  .then(function (client) {
    var date = new Date();
    client.query(
      'UPDATE donations '+
      'SET contact_id = $1, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
      'WHERE id = $6',
      [
        donation.contact_id,
        donation.timestamp,
        donation.timestamp,
        req.user.id,
        date.toISOString(),
        donation.donation_id
      ]
    )
    .then(function (result) {
      var categories = Object.keys(donation.categories);
      var query = {
        text: `WITH vals (distribution_id, category_id, amount) AS (VALUES ${details})
              INSERT INTO distribution_details 
              SELECT * FROM vals
              ON CONFLICT (distribution_id, category_id) DO UPDATE
              SET amount = excluded.amount`,
        values: []
      };

      categories.forEach(function (category) {

      })

      client.query(query)
      .then(function (response) {
        res.sendStatus(200)
      })
      .catch(function (err) { 
        console.log('UPSERT donation detail error:', err);
        res.status(500).send(err)
      })
    })
    .catch(function (err) {
      console.log('POST donation error:', err)
      res.status(500).send(err)
    })
  })
})

router.get('/csvtest', function(req, res) {
  pool.query(
    'SELECT * FROM donations'
  )
  .then(function(result) {
    // console.log('result: ', result.rows);
    res.attachment('testing.csv');
    res.csv(
      result.rows
    );
  })
  .catch(function(err) {
    console.log('GET all donations err:', err);
    res.status(500).send(err);
  });
});

module.exports = router;
