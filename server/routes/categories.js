var express = require('express')
var router = express.Router()
var pg = require('pg')

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

router.get('/', function (req, res) {
  pool.query(
    'SELECT * FROM categories'
  )
  .then(function (result) {
    res.send(result.rows)
  })
  .catch(function (err) {
    console.log('GET all categories error:', err);
    res.status(500).send(err)
  })
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
    console.log('POST category error:', err)
    res.status(500).send(err)
  })
})

module.exports = router
