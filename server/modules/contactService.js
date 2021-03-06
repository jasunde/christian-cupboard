var pg = require('pg');
var config = require('../config');
var contacts = {};

var pool = new pg.Pool(config.pg);

function findOrganization(req, res, next) {
  var params = 2;
  var query = {
    text: 'SELECT * FROM contacts WHERE '+
    ' org_name = $1',
    values: [req.body.org_name]
  };

  if(req.body.address || req.body.email || req.body.phone_number) {
    query.text += ' AND (';
  }

  if(req.body.address) {
    query.text += ' address = $' + params;
    query.values.push(req.body.address);
    params++;
  }

  if(req.body.email) {
    if(params > 2) { query.text += ' OR';
  }
    query.text += ' email = $' + params;
    query.values.push(req.body.email);
    params++;
  }

  if(req.body.phone_number) {
    if(params > 2) { query.text += ' OR';
  }
    query.text += ' phone_number = $' + params;
    query.values.push(req.body.phone_number);
    params++;
  }

  if(req.body.address || req.body.email || req.body.phone_number) {
    query.text += ')';
  }

  pool.query(query)
  .then(function (result) {
    if(result.rows[0]) {
      req.contact = result.rows[0];
    }
    // console.log('req.contact: ', req.contact);
    next();
  })
  .catch(function (err) {
    console.log('SELECT organization error:', err);
    res.status(500).send(err);
  });

}

function findIndividual(req, res, next) {
  var params = 3;
  if(!req.body.first_name && !req.body.last_name) {
    req.body.first_name = 'Anonymous';
    req.body.last_name = 'Person';
  }
  var query = {
    text: 'SELECT * FROM contacts WHERE '+
    ' first_name = $1 AND last_name = $2',
    values: [req.body.first_name, req.body.last_name]
  };

  if(req.body.address || req.body.email || req.body.phone_number) {
    query.text += ' AND (';
  }

  if(req.body.address) {
    query.text += ' address = $' + params;
    query.values.push(req.body.address);
    params++;
  }

  if(req.body.email) {
    if(params > 3) { query.text += ' OR';
  }
    query.text += ' email = $' + params;
    query.values.push(req.body.email);
    params++;
  }

  if(req.body.phone_number) {
    if(params > 3) { query.text += ' OR';
  }
    query.text += ' phone_number = $' + params;
    query.values.push(req.body.phone_number);
    params++;
  }

  if(req.body.address || req.body.email || req.body.phone_number) {
    query.text += ')';
  }

  pool.query(query)
  .then(function (result) {
    if(result.rows[0]) {
      req.contact = result.rows[0];
    }
    // console.log('req.contact: ', req.contact);
    next();
  })
  .catch(function (err) {
    console.log('SELECT individual error:', err);
    res.status(500).send(err);
  });

}

function find(req, res, next) {
  // console.log('req.body', req.body);
  if(req.body.contact_id) {
    getByID(req, res, req.body.contact_id)
    .then(function (result) {
      if(result) {
        // console.log(result);
        req.contact = result.rows[0];
      }
      next();
    });
  } else {
    if(req.body.org_name) {
      findOrganization(req, res, next);
    } else {
      findIndividual(req, res, next);
    }
  }
}

function upsert(req, res) {
  // Compensate for empty strings
  var bodyKeys = Object.keys(req.body);
  bodyKeys.forEach(function (property) {
    if(typeof req.body[property] === 'string') {
      if(!req.body[property].trim()) {
        req.body[property] = null;
      }
    }
  });

  console.log('req.body', req.body);

  if(req.contact) {
    bodyKeys.forEach(function (property) {
      if(req.body[property]) {
        req.contact[property] = req.body[property];
      }
    });

    return put(req, res);
  } else {
    req.contact = req.body;

    return post(req, res);
  }
}

function getByID(req, res, id) {
  return pool.query(
    'SELECT * FROM contacts WHERE id = $1',
    [
      id
    ]
  )
  .then(function(result) {
    return result;
  })
  .catch(function(err) {
    console.log('GET by ID error:', err);
    res.status(500).send(err);
  });

}

function post(req, res) {
  var contact = req.contact;
  var date = new Date();
  return pool.query(
    'INSERT INTO contacts (donor, org, org_type, org_id, org_name, first_name, last_name, address, city, state, postal_code, email, phone_number, is_active, date_entered, family_size)'+
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) '+
    'RETURNING id',
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
      true,
      date.toISOString(),
      contact.family_size
    ]
  )
  .then(function(result) {
    req.contact.id = result.rows[0].id;
    return result;
  })
  .catch(function(err) {
    console.log('POST contact error:', err);
    res.status(500).send(err);
  });
}

function put(req, res) {
  var contact = req.contact;
  return pool.query(
    'UPDATE contacts '+
    'SET donor = $1, org = $2, org_type = $3, org_id = $4, org_name = $5, first_name = $6, last_name = $7, address = $8, city = $9, state = $10, postal_code = $11, email = $12, phone_number = $13, is_active = $14, family_size = $15 '+
    'WHERE id = $16',
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
      contact.is_active,
      contact.family_size,
      contact.id
    ]
  )
  .then(function(response) {
    return response;
  })
  .catch(function(err) {
    console.log('PUT category error:', err);
    res.status(500).send(err);
  });
}

module.exports = {
  find: find,
  getByID: getByID,
  post: post,
  put: put,
  upsert: upsert
};
