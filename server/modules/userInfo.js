var pg = require('pg')
var pool = new pg.Pool({
  database: 'christian_cupboard'
})

module.exports = function (req, res, next) {
  pool.query(
    'SELECT * FROM users '+
    'WHERE email = $1',
    ['jlaurits@gmail.com']
  )
  .then(function (result) {
    req.user = result.rows[0]
    next();
  })
  .catch(function (err) {
    console.log('User access error:', err);
    res.sendStatus(403)
  })
}
