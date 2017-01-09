var express = require('express')
var router = express.Router()
var pg = require('pg')

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

router.post('/', function (req, res) {
  var donation = req.body
  pool.connect()
  .then(function (client) {
    client.query(
      'INSERT INTO donations (organization_id, timestamp, date, added_by) '+
      'VALUES ($1, $2, $3, $4) '+
      'RETURNING id',
      [
        donation.organization_id,
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
    })
    .catch(function (err) {
      console.log('POST donation error:', err)
      res.status(500).send(err)
    })
  })
})

module.exports = router;
