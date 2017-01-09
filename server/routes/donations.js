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
      'VALUES ($1, $2, $3, $4)',
      [
        donation.organization_id,
        donation.timestamp,
        donation.timestamp,
        req.user.id
      ]
    )
    .then(function (response) {
      console.log('insert donation response', response);
      client.release()
      res.sendStatus(200)
    })
    .catch(function (err) {
      console.log('POST donation error:', err)
      res.status(500).send(err)
    })
  })
})

module.exports = router;
