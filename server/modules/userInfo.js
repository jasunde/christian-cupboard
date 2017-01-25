var pg = require('pg')
var config = require('../config')

var pool = new pg.Pool(config.pg)

module.exports = function (req, res, next) {
  pool.query(
    'SELECT * FROM users '+
    'WHERE email = $1',
    [req.decodedToken.email]
  )
  .then(function (result) {
    req.user = result.rows[0]
    if(req.user) {
      next();
    } else {
      res.sendStatus(403);
    }
  })
  .catch(function (err) {
    console.log('User access error:', err);
    res.sendStatus(403)
  })
}
