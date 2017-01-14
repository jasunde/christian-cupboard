var pg = require('pg');
var config = require('../config')
var contacts = {}

var pool = new pg.Pool(config.pg);

contacts.find = function (req, res) {
  
  res.send({stuff: null})
}

contacts.post = function(req, res) {
  var contact = req.body;
  pool.query(
    'INSERT INTO contacts (donor, org, org_type, org_id, org_name, first_name, last_name, address, city, state, postal_code, email, phone_number)'+
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
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
      contact.phone_number
    ]
  )
  .then(function(response) {
    res.sendStatus(204)
  })
  .catch(function(err) {
    console.log('POST contact error:', err);
    res.status(500).send(err);
  });
};

module.exports = contacts;
