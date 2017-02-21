var express = require('express');
var router = express.Router();
var pgEscape = require('pg-escape');
var contactService = require('../modules/contactService');
var pg = require('pg');
var config = require('../config');
var moment = require('moment');

var pool = new pg.Pool(config.pg);

var rollback = function (client, done, res) {
  client.query('ROLLBACK', function (err) {
    res.status(500).send(err);
    return done(err);
  });
};

var MAX_GET = 1000;

function notParam(param) {
  return param.indexOf('!') > -1;
}

function buildQuery(query, categories, toCsv) {
  var param = 1;
  var categoryList = '';
  categories.forEach(function (category, index) {
    categoryList += ' "' + pgEscape(category.name) + '" NUMERIC';
    if(index < categories.length - 1) {
      categoryList += ', ';
    }
  });


  if(toCsv) {
    var selection = 'contacts.org_name, contacts.first_name, contacts.last_name, ct.*';
  } else {
    selection = '*';
  }

  var result = {
    text: `SELECT ${selection} FROM
          crosstab(
            'SELECT
              donations.id AS donation_id,
              donations.date AS date,
              donations.contact_id AS contact_id,
              donations.timestamp AS timestamp,
              donations.date_entered AS donation_entered,
              name,
              amount
            FROM donations
            LEFT JOIN donation_details ON donations.id = donation_details.donation_id
            LEFT JOIN categories ON categories.id = donation_details.category_id
            ORDER BY 1,2',
            'SELECT name FROM categories'
          ) AS ct(
            donation_id INTEGER,
            date DATE,
            contact_id INTEGER,
            timestamp TIMESTAMP,
            donation_entered TIMESTAMP,
            ${categoryList}
          )
          LEFT JOIN contacts ON contacts.id = contact_id`,
    values: []
  };

  if(query.contact_id) {
    result.text += ' WHERE contact_id = $' + param;
    result.values.push(query.contact_id);
    param++;
  } else if (query.org_type) {
    if(notParam(query.org_type)) {
      result.text += ' WHERE NOT org_type = $' + param +
        ' OR org_type IS NULL';
      result.values.push(query.org_type.replace('!', ''));
    } else {
      result.text += ' WHERE org_type = $' + param;
      result.values.push(query.org_type);
    }
    param++;
  } else if (query.donation_id) {
    result.text += ' WHERE donation_id = $' + param;
    result.values.push(query.donation_id);
    param++;
  }

  if(query.start_date || query.end_date) {
    if(query.contact_id || query.org_type) {
      result.text += ' AND';
    } else {
      result.text += ' WHERE';
    }

    if(query.start_date) {
      result.text += ' date >= $' + param;
      param++;
      result.values.push(moment(query.start_date).format('YYYY-MM-DD'));
    }

    if(query.start_date && query.end_date) {
      result.text += ' AND';
    }

    if(query.end_date) {
      result.text += ' date < $' + param;
      param++;
      result.values.push(moment(query.end_date).add(1, 'day').format('YYYY-MM-DD'));
    }
  } else {
    result.text += ' LIMIT ' + MAX_GET;
  }

  console.log('query', result.values);
  return result;
}

//Takes care of getBy ContactID, getBYDateRange, and getByOrgType
router.get('/', function (req, res) {
    pool.query(
      'SELECT * FROM categories'
    )
      .then(function (result) {
        var query = buildQuery(req.query, result.rows);

        pool.query(query)
        .then(function (result) {
          res.send(result.rows);
        })
        .catch(function (err) {
          console.log('GET donations error:', err);
          res.status(500).send(err);
        });
      })
      .catch(function (err) {
        console.log('GET categories error:', err);
        res.status(500).send(err);
      });

});

// Get by ID
router.get('/id/:id', function (req, res) {
  pool.query(
    'SELECT * FROM categories'
  )
    .then(function (result) {
      var query = buildQuery({donation_id: req.params.id}, result.rows);

      pool.query(query)
        .then(function (result) {
          res.send(result.rows);
        })
        .catch(function (err) {
          console.log('GET donation by id error:', err);
          res.status(500).send(err);
        });
    })
    .catch(function (err) {
      console.log('GET categories error:', err);
      res.status(500).send(err);
    });
});

router.delete('/:id', function (req, res) {
  pool.query(
    'DELETE FROM donations '+
    'WHERE id = $1',
    [req.params.id]
  )
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      console.log('DELETE donation error:', err);
      req.sendStatus(500);
    });
});

router.get('/csv', function(req, res) {
  pool.query(
    'SELECT * FROM categories'
  )
    .then(function (result) {
      var query = buildQuery(req.query, result.rows, true);

      pool.query(query)
        .then(function (result) {
          var data = result.rows.map(function (row) {
            row.date = toDateString(row.date);
            row.donation_entered = toDateString(row.donation_entered);
            return row;
          });
          res.attachment('testing.csv');
          if(result.rows.length) {
            var headers = Object.keys(result.rows[0]);
            data.unshift(headers);
          }
          res.csv(data);
        })
        .catch(function (err) {
          console.log('GET donations error:', err);
          res.status(500).send(err);
        });
    })
    .catch(function (err) {
      console.log('GET categories error:', err);
      res.status(500).send(err);
    });

});

router.use(contactService.find);
router.use(function (req, res, next) {
  // Contacts managed by admin
  if(req.contact) {
    if(req.contact.org_type === 'food_rescue') {
      next();
    } else {

      // Contacts not managed by admin
      contactService.upsert(req, res)
        .then(function (response) {
          req.body.contact_id = req.contact.id;
          next();
        });
    }
  } else {
    req.body.donor = true;
    if(req.body.org_name) {
      req.body.org = true;
      req.body.org_type = 'donor';
    } else {
      req.body.org = false;
    }

    contactService.upsert(req, res)
      .then(function (response) {
        req.body.contact_id = req.contact.id;
        next();
      });
  }
});

router.post('/', function (req, res) {
  if(req.body.categories) {
    var donation = req.body;
    pool.connect(function (err, client, done) {
      if(err) throw err;

      client.query('BEGIN', function (err) {
        if(err) return rollback(client, done, res);

        process.nextTick(function () {
          var date = new Date();

          var query = {
            text: 'INSERT INTO donations (contact_id, timestamp, date, added_by, date_entered) '+
            'VALUES ($1, $2, $3, $4, $5) '+
            'RETURNING id',
            values: [
              req.contact.id,
              donation.timestamp,
              donation.timestamp,
              req.user.id,
              date.toISOString()
            ]
          };

          client.query(query, function (err, result) {
            if(err) return rollback(client, done, res);

            var donation_id = result.rows[0].id;

            var categories = Object.keys(donation.categories);

            var param = 1;

            var query = {
              text: 'INSERT INTO donation_details (donation_id, category_id, amount) '+
              'VALUES ',
              values: [],
              name: 'insert-donation-details'
            };

            categories.forEach(function (category, index) {
              query.text += '($' + (param++) +', $' + (param++) +', $' + (param++) +')';
              if(index < categories.length - 1) {
                query.text += ', ';
              }
              query.values.push(donation_id, category, donation.categories[category]);
            });

            client.query(query, function (err) {
              if(err) return rollback(client, done, res);
              client.query('COMMIT', function () {
                done();
                res.sendStatus(200);
              });
            });
          });
        });
      });
    });
  } else {
    res.status(500).send('No categories');
  }
});

router.put('/', function (req, res) {
  var donation = req.body;

  pool.connect(function (err, client, done) {
    if(err) throw err;

    client.query('BEGIN', function (err) {
      if(err) return rollback(client, done, res);

      process.nextTick(function () {
        var date = new Date();
        var query = {
          text: 'UPDATE donations '+
            'SET contact_id = $1, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
            'WHERE id = $6',
          values: [
            donation.contact_id,
            donation.timestamp,
            donation.timestamp,
            req.user.id,
            date.toISOString(),
            donation.donation_id
          ]
        };

        client.query(query, function (err, result) {
          if(err) return rollback(client, done, res);

          var param = 1;
          var categories = Object.keys(donation.categories);
          var details = '';
          var values = [];

          categories.forEach(function (category, index) {
            details += '($' + (param++) +'::int, $' + (param++) +'::int, $' + (param++) +'::numeric)';
            if(index < categories.length - 1) {
              details += ', ';
            }
            if(donation.categories[category] === '') {
              donation.categories[category] = 0;
            }
            values.push(donation.donation_id, category, donation.categories[category])
          });
          console.log('values', values);

          var query = {
            text: `WITH vals (donation_id, category_id, amount) AS (VALUES ${details})
                  INSERT INTO donation_details
                  SELECT * FROM vals
                  ON CONFLICT (donation_id, category_id) DO UPDATE
                  SET amount = excluded.amount`,
            values: values
          };


          client.query(query, function (err) {
            if(err) return rollback(client, done, res);

            client.query('COMMIT', function () {
              done();
              res.sendStatus(200);
            });
          });
        });
      });
    });
  });
});

function toDateString(timestamp) {
  return moment(timestamp).format('YYYY-MM-DD');
}

module.exports = router;
