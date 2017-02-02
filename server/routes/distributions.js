var express = require('express');
var router = express.Router();
var pgEscape = require('pg-escape')
var contactService = require('../modules/contactService')
var pg = require('pg');

var config = require('../config')

var pool = new pg.Pool(config.pg)

var rollback = function (client, done, res) {
  client.query('ROLLBACK', function (err) {
    res.status(500).send(err);
    return done(err);
  });
};

var MAX_GET = 1000;

function buildQuery(query, categories) {
  var param = 1;
  // console.log('categories', categories);
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
          'SELECT 
            distributions.id AS distribution_id, 
            distributions.date AS date, 
            distributions.contact_id AS contact_id, 
            distributions.timestamp AS timestamp, 
            name, amount 
          FROM distributions 
          LEFT JOIN distribution_details ON distributions.id = distribution_details.distribution_id 
          LEFT JOIN categories ON categories.id = distribution_details.category_id 
          ORDER BY 1,2', 
          'SELECT name FROM categories') 
          AS ct(
            distribution_id INTEGER, 
            date DATE, 
            contact_id INTEGER, 
            timestamp TIMESTAMP, 
            ${categoryList}
          ) 
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

  // console.log('result', result);
  return result
}

// function getDetails(distributions, client, res) {
//   if(distributions.length) {
//     distributions.forEach(function(distribution, index) {
//       client.query(
//         'SELECT * FROM distribution_details '+
//         'WHERE distribution_id = $1',
//         [distribution.distribution_id]
//       )
//         .then(function(result) {
//           distribution.categories = result.rows.reduce(function(total, current) {
//             total[current.category_id] = parseFloat(current.amount);
//             return total;
//           }, {})
//           if(distributions.length === index + 1) {
//             client.release();
//           }
//         });

//     });
//   } else {
//     client.release();
//     res.send(distributions);
//   }

//   // client.on('drain', client.end.bind(client) )

//   client.on('end', function() {
//     res.send(distributions)
//   });

//   client.on('error', function(err) {
//     res.status(500).send(err)
//   });


// }

//get all organizations
router.get('/organizations', function(req, res) {
  pool.connect()
    .then(function (client) {
      client.query(
        'SELECT *, distributions.id as distribution_id FROM distributions '+
        'JOIN contacts ON distributions.contact_id = contacts.id '+
        'WHERE contacts.org IS TRUE'
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
        'SELECT *, distributions.id AS distribution_id FROM distributions '+
        'JOIN contacts ON distributions.contact_id = contacts.id '+
        'WHERE contacts.org IS FALSE'
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
  pool.query(
    'SELECT * FROM categories'
  )
  .then(function (result) {
    var query = buildQuery(req.query, result.rows);

    pool.query(query)
    .then(function (result) {
      res.send(result.rows)
    })
    .catch(function (err) {
      console.log('GET distributions error:', err);
      res.status(500).send(err)
    })
  })
  .catch(function (err) {
    console.log('GET categories error:', err);
    res.status(500).send(err)
  })
});

router.delete('/:id', function(req, res) {
  pool.query(
    'DELETE FROM distributions '+
    'WHERE id = $1',
    [req.params.id]
  )
    .then(function () {
      res.status(200);
    })
    .catch(function (err) {
      console.log('DELETE distribution error:', err)
      req.status(500)
    })
})

router.use(contactService.find)
router.use(function (req, res, next) {
  // Contacts managed by admin
  if(req.contact) {
    if(req.contact.org_type === 'sub_distribution') {
      next();
    } else {
      contactService.upsert(req, res)
      .then(function (response) {
        req.body.contact_id = req.contact.id
        next()
      })
    }
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

  pool.connect(function (err, client, done) {
    if(err) throw err

    client.query('BEGIN', function (err) {
      if(err) return rollback(client, done, res)

      process.nextTick(function () {
        var date = new Date()

        var insertDistribution = {
          text: 'INSERT INTO distributions (contact_id, date, added_by, timestamp, date_entered) '+
          'VALUES ($1, $2, $3, $4, $5) '+
          'RETURNING id',
          values: [
            req.contact.id,
            distribution.timestamp,
            req.user.id,
            distribution.timestamp,
            new Date()
          ]
        }

        client.query(insertDistribution, function (err, result) {
          if(err) return rollback(client, done, res)
          
          var distribution_id = result.rows[0].id
          var categories = Object.keys(distribution.categories);

          var param = 1;

          var insertDetails = {
            text: 'INSERT INTO distribution_details (distribution_id, category_id, amount) '+
            'VALUES ',
            values: [],
            name: 'insert-distribution-details'
          }

          categories.forEach(function (category, index) {
            insertDetails.text += '($' + (param++) +', $' + (param++) +', $' + (param++) +')'
            if(index < categories.length - 1) {
              insertDetails.text += ', '
            }
            insertDetails.values.push(distribution_id, category, distribution.categories[category])
          });

          client.query(insertDetails, function (argument) {
            if(err) return rollback(client, done, res)
            client.query('COMMIT', function () {
              done()
              res.status(200)
            })
          })
        })
      })
    })
  })

});

router.put('/', function(req, res) {
  var distribution = req.body
  pool.connect(function (err, client, done) {
    if(err) throw err

    client.query('BEGIN', function (err) {
      if(err) return rollback(client, done, res)

      process.nextTick(function () {
        var date = new Date();
        var updateDistribution = {
          text: 'UPDATE distributions '+
          'SET contact_id = $1, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
          'WHERE id = $6',
          values: [
            distribution.contact_id,
            distribution.timestamp,
            distribution.timestamp,
            req.user.id,
            date.toISOString(),
            distribution.distribution_id
          ]
        }
        client.query(updateDistribution, function (err, result) {
          if(err) return rollback(client, done, res)

          var param = 1;
          var categories = Object.keys(distribution.categories);
          var details = '';
          var values = [];
          categories.forEach(function(category, index) {
            details += '($' + (param++) +'::int, $' + (param++) +'::int, $' + (param++) +'::numeric)'
            if(index < categories.length - 1) {
              details += ', '
            }
            values.push(distribution.distribution_id, category, distribution.categories[category])
          });

          var updateDetails = {
            text: `WITH vals (distribution_id, category_id, amount) AS (VALUES ${details})
                  INSERT INTO distribution_details 
                  SELECT * FROM vals
                  ON CONFLICT (distribution_id, category_id) DO UPDATE
                  SET amount = excluded.amount`,
            values: values
          };

          client.query(updateDetails, function (err) {
            if(err) return rollback(client, done, res)

            client.query('COMMIT', function () {
              done()
              res.status(200)
            })
          })
        })
      })
    })
  })
})

router.get('/csvtest', function(req, res) {
  pool.query(
    'SELECT * FROM distributions'
  )
  .then(function(result) {
    console.log('result: ', result.rows);
    res.attachment('testing.csv');
    res.csv(
      result.rows
    );
  })
  .catch(function(err) {
    console.log('GET all distributions err:', err);
    res.status(500).send(err);
  });
});

module.exports = router;
