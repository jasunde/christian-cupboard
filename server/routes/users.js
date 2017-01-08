var express = require('express')
var router = express.Router()
var pg = require('pg')

var pool = new pg.Pool({
  database: 'christian_cupboard'
})

router.get('/', function (req, res) {
  pool.query(
    'SELECT * FROM users'
  )
  .then(function (result) {
    res.send(result.rows)
  })
  .catch(function (err) {
    console.log('GET users error:', err)
    res.sendStatus(500)
  })
})

router.get('/:id', function (req, res) {
  pool.query(
    'SELECT * FROM users '+
    'WHERE id = $1',
    [req.params.id]
  )
  .then(function (result) {
    res.send(result.rows[0])
  })
  .catch(function (err) {
    console.log('GET user by id error:', err);
    res.sendStatus(500)
  })
})

router.post('/', function (req, res) {
  var user = req.body
  pool.query(
    'INSERT INTO users (first_name, last_name, email, is_admin) '+
    'VALUES ($1, $2, $3, $4)',
    [
      user.first_name,
      user.last_name,
      user.email,
      user.is_admin
    ]
  )
  .then(function (response) {
    res.sendStatus(200)
  })
  .catch(function (err) {
    console.log('POST user error:', err);
    res.sendStatus(500)
  })
})

router.put('/', function (req, res) {
  var user = req.body
  pool.query(
    'UPDATE users '+
    'SET first_name = $1, last_name = $2, email = $3, is_admin = $4, is_active = $5 '+
    'WHERE id = $6',
    [
      user.first_name,
      user.last_name,
      user.email,
      user.is_admin,
      user.is_active,
      user.id
    ]
  )
  .then(function (response) {
    res.sendStatus(204)
  })
  .catch(function (err) {
    console.log('PUT user error:', err);
    res.sendStatus(500)
  })
})

module.exports = router
