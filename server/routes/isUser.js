var express = require('express');
var router = express.Router();

var pg = require('pg');
var config = require('../config');

var pool = new pg.Pool(config.pg);


router.get('/:email', function (req, res) {
  pool.query(
    'SELECT * FROM users '+
    'WHERE email = $1',
    [req.params.email]
  )
  .then(function (result) {
    res.send(result.rows[0]);
  })
  .catch(function (err) {
    console.log('GET user by email error:', err);
    res.sendStatus(500);
  });
});

module.exports = router;
