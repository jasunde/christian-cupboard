var express = require('express');
var router = express.Router();
var contactService = require('../modules/contacts')

var pg = require('pg');
var config = require('../config')

var pool = new pg.Pool(config.pg);

console.log('contactService', contactService);

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

router.post('/', contactService.post);

router.put('/', function(req, res) {
  var contact = req.body;
  pool.query(
    'UPDATE contacts '+
    'SET donor = $1, org = $2, org_type = $3, org_id = $4, org_name = $5, first_name = $6, last_name = $7, address = $8, city = $9, state = $10, postal_code = $11, email = $12, phone_number = $13 '+
    'WHERE id = $14',
    [
      contact.donor,
      contact.org,
      contact.org_type,
      contact.org_id,
      contact.org_name,
      contact.first_name,
      contact.last_name,
      contact.address,
      contact.city,
      contact.state,
      contact.postal_code,
      contact.email,
      contact.phone_number,
      contact.id
    ]
  )
  .then(function(response) {
    res.sendStatus(204)
  })
  .catch(function(err) {
    console.log('PUT category error:', err);
    res.status(500).send(err);
  });
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
