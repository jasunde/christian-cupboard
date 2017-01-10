var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = new pg.Pool({
  database: 'christian_cupboard'
});

router.get('/', function(req, res) {
  pool.query(
    'SELECT * FROM organizations'
  )
  .then(function(result) {
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET all organizations err:', err);
    res.status(500).send(err);
  });
});

router.get(':type', function(req, res) {
  var formTypes = [
    'food_rescue',
    'sub_distribution',
    'donor'
  ];

  var isFormType = formTypes.some(function(type) {
    return type = req.params.type;
  });

if(isFormType)
  pool.query(
    'SELECT * FROM organizations '+
    'WHERE ' + req.params.type + '= true'
  )
  .then(function(result) {
    res.send(result.rows)
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
  else{
    console.log('GET by type error', req.params.type, 'is not a valid type');
    res.status(400).send('GET by type error', req.params.type, 'is not a valid type');
  }
});

router.get('/:id', function(req, res) {

  pool.query(
    'SELECT * FROM organizations WHERE id = $1',
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

router.post('/', function(req, res) {
  var organization = req.body;
  pool.query(
    'INSERT INTO organizations (type, name, address, city, state, postal_code, email, phone_number)'+
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      organization.type,
      organization.name,
      organization.address,
      organization.city,
      organization.state,
      organization.postal_code,
      organization.email,
      organization.phone_number
    ]
  )
  .then(function(response) {
    res.sendStatus(204)
  })
  .catch(function(err) {
    console.log('POST organization error:', err);
    res.status(500).send(err);
  });
});

router.put('/', function(req, res) {
  var organization = req.body;
  pool.query(
    'UPDATE organizations'+
    'SET type = $1, name = $2, address = $3, city = $4, state = $5, postal_code = $6, email = $7, phone_number = $8 '+
    'WHERE id = $9',
    [
      organization.type,
      organization.name,
      organization.address,
      organization.city,
      organization.state,
      organization.postal_code,
      organization.email,
      organization.phone_number,
      organization.id
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

module.exports = router;
