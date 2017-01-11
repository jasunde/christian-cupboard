var express = require('express')
var router = express.Router()
var pg = require('pg')
var config = require('../config')

var pool = new pg.Pool(config.pg)

var MAX_GET = 1000

function buildQuery(query) {
  var param = 1;
  var result = {
    text: 'SELECT donations.id as donation_id, contacts.id as contact_id, * FROM donations '+
      'JOIN contacts ON donations.contact_id = contacts.id',
    values: []
  }

  console.log('query', query);

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

  console.log('result', result)
  return result
}

//Takes care of getBy ContactID, getBYDateRange, and getByOrgType
router.get('/', function (req, res) {
  pool.connect()
  .then(function (client) {
    var query = buildQuery(req.query)

    client.query(query)
    .then(function (result) {
      var donations = result.rows

      donations.forEach(function (donation) {
        client.query(
          'SELECT * FROM donation_details '+
          'WHERE donation_id = $1',
          [donation.donation_id]
        )
        .then(function (result) {
          donation.categories = result.rows
        })
      })

      client.on('drain', client.end.bind(client) )

      client.on('end', function () {
        res.send(donations)
      })

      client.on('error', function (err) {
        res.status(500).send(err)
      })
    })
  })
})

// Get by ID
router.get('/:id', function (req, res) {
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
      console.log(donation);

      client.query(
        'SELECT * FROM donation_details '+
        'WHERE donation_id = $1',
        [donation.donation_id]
      )
      .then(function (result) {
        client.release()
        donation.categories = result.rows
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

router.post('/', function (req, res) {
  var donation = req.body
  pool.connect()
  .then(function (client) {
    client.query(
      'INSERT INTO donations (contact_id, timestamp, date, added_by) '+
      'VALUES ($1, $2, $3, $4) '+
      'RETURNING id',
      [
        donation.contact_id,
        donation.timestamp,
        donation.timestamp,
        req.user.id
      ]
    )
    .then(function (result) {
      var donation_id = result.rows[0].id

      donation.categories.forEach(function (category) {
        client.query({
          text: 'INSERT INTO donation_details (donation_id, category_id, amount) '+
          'VALUES ($1, $2, $3)',
          values: [donation_id, category.id, category.amount],
          name: 'insert-donation-details'
        })
      })

      client.on('drain', client.end.bind(client) )

      client.on('end', function () {
        res.sendStatus(200)
      })

      client.on('error', function (err) {
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
  pool.connect()
  .then(function (client) {
    var d = new Date();
    client.query(
      'UPDATE donations '+
      'SET contact_id = $1, timestamp = $2, date = $3, updated_by = $4, last_update = $5 '+
      'WHERE id = $6',
      [
        donation.contact_id,
        donation.timestamp,
        donation.timestamp,
        req.user.id,
        d.toISOString(),
        donation.donation_id
      ]
    )
    .then(function (result) {
      donation.categories.forEach(function (category) {
        client.query({
          text: 'INSERT INTO donation_details (donation_id, category_id, amount) '+
          'VALUES ($1, $2, $3) '+
          'ON CONFLICT (donation_id, category_id) DO UPDATE '+
          'SET amount = $3',
          values: [category.donation_id, category.category_id, category.amount],
          name: 'upsert-donation-details'
        })
      })

      client.on('drain', client.end.bind(client) )

      client.on('end', function () {
        res.sendStatus(200)
      })

      client.on('error', function (err) {
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

module.exports = router;
