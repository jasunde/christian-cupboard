var express = require('express')
var router = express.Router()
var pg = require('pg')

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

router.post('/', function (req, res) {
  var category = req.body
  pool.query(
    'INSERT INTO categories (name, food_rescue, food_drive, daily_dist, sub_dist) '+
    'VALUES ($1, $2, $3, $4, $5)',
    [
      category.name,
      category.food_rescue,
      category.food_drive,
      category.daily_dist,
      category.sub_dist
    ]
  )
  .then(function (response) {
    res.sendStatus(200)
  })
  .catch(function (err) {
    console.log('POST category error:', err);
    res.sendStatus(500)
  })
})

module.exports = router
