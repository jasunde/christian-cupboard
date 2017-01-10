var express = require('express')
var router = express.Router()
var pg = require('pg')

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

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
      
      client.on('drain', function () {
        client.end.bind(client)
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

module.exports = router;
