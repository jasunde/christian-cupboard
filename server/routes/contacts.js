var express = require('express');
var router = express.Router();
var csv = require('express-csv');
var contactService = require('../modules/contactService');

var pg = require('pg');
var config = require('../config');

var pool = new pg.Pool(config.pg);

// middleware to facilitate contact upsert
router.use(function (req, res, next) {
  if(req.body) {
    req.contact = req.body;
  }
  next();
});

router.get('/all', function(req, res) {
  pool.query(
    'SELECT * FROM contacts'
  )
  .then(function(result) {
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET all contacts error:', err);
    res.status(500).send(err);
  });
});

router.get('/non-clients', function (req, res) {
  pool.query(
    'SELECT * FROM contacts '+
    'WHERE NOT (donor = FALSE AND org = FALSE)'
  )
  .then(function (result) {
    res.send(result.rows);
  })
  .catch(function (err) {
    console.log('GET non-client contacts error:', err);
    res.status(500).send(err);
  });
});

router.get('/', function(req, res) {
  pool.query(
    'SELECT * FROM contacts WHERE is_active IS TRUE'
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
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
});



router.get('/id/:id', function(req, res) {

  contactService.getByID(req, res, req.params.id)
  .then(function (result) {
    if(result) {
      res.send(result.rows);
    }
  });
});

router.post('/', function (req, res) {
  req.body.donor = true;
  if(req.body.org_name) {
    req.body.org = true;
    if(!req.body.org_type) {
      req.body.org_type = 'food_rescue';
    }
  } else {
    req.body.org = false;
  }
  contactService.post(req,res)
  .then(function (response) {
    if(response) {
      res.sendStatus(204);
    }
  });
});

router.put('/', function (req, res) {
  console.log('We are doing a put');
  contactService.put(req, res)
  .then(function (response) {
    if(response) {
      res.sendStatus(204);
    }
  });
});

//toggle is_active
router.put('/active/:id', function(req, res) {
console.log('putting now');
  pool.query(
    'UPDATE contacts '+
    'SET is_active = NOT is_active WHERE id = $1',
    [
      req.params.id
    ]
  )
  .then(function(response) {
    res.sendStatus(204);
  })
  .catch(function(err) {
    console.log('PUT contact error: ', err);
    res.status(500).send(err);
  });
});

router.get('/donors/org', function(req, res) {

  pool.query(
    'SELECT * FROM contacts '+
    'WHERE donor = TRUE AND org = TRUE'
  )
  .then(function(result) {
    res.send(result.rows);
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
    res.send(result.rows);
  })
  .catch(function(err) {
    console.log('GET by type error:', err);
    res.status(500).send(err);
  });
});

router.get('/csvtest', function(req, res) {
  pool.query(
    'SELECT * FROM contacts'
  )
  .then(function(result) {
    console.log('result: ', result.rows);
    res.attachment('testing.csv');
    var headers = Object.keys(result.rows[0]);
    result.rows.unshift(headers);
    res.csv(
      result.rows
    );
  })
  .catch(function(err) {
    console.log('GET all contacts err:', err);
    res.status(500).send(err);
  });
});


module.exports = router;
