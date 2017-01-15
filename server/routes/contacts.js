var express = require('express');
var router = express.Router();
var contactService = require('../modules/contactService')

var pg = require('pg');
var config = require('../config')

var pool = new pg.Pool(config.pg);

// middleware to facilitate contact upsert
router.use(function (req, res, next) {
  if(req.body) {
    req.contact = req.body
  }
  next()
})

router.get('/', function(req, res) {
  pool.query(
    'SELECT * FROM contacts'
  )
  .then(function(result) {
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET all contacts err:', err);
    res.status(500).send(err);
  });
});

router.get('/organizations/:org_type', function(req, res) {

  pool.query(
    'SELECT * FROM contacts '+
    'WHERE org_type = $1',
    [
      req.params.org_type
    ]
  )
  .then(function(result) {
    res.send(result.rows)
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
});

router.get('/id/:id', function(req, res) {

  pool.query(
    'SELECT * FROM contacts WHERE id = $1',
    [
      req.params.id
    ]
  )
  .then(function(result) {
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET by ID error:', err);
    res.status(500).send(err);
  });
});

router.post('/', function (req, res) {
  contactService.post(req,res)
  .then(function (response) {
    if(response) {
      res.sendStatus(204)
    }
  })
});

router.put('/', function (req, res) {
  contactService.put(req, res)
  .then(function (response) {
    if(response) {
      res.sendStatus(204)
    }
  })
});

router.get('/donors/org', function(req, res) {

  pool.query(
    'SELECT * FROM contacts '+
    'WHERE donor = TRUE AND org = TRUE'
  )
  .then(function(result) {
    res.send(result.rows)
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
});

router.get('/donors/individual', function(req, res) {

  pool.query(
    'SELECT * FROM contacts '+
    'WHERE donor = TRUE and org = FALSE'
  )
  .then(function(result) {
    res.send(result.rows)
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
});

module.exports = router;
