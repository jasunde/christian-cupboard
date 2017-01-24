var pgPoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB,
  ssl: true,
  max: 10, // max number of clients in pool
  idleTimeoutMillis: 1000, // close & remove clients which have been idle > 1 second
}

var localPoolConfig = {
  // user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  host: 'localhost',
  database: 'christian_cupboard',
  // ssl: true,
  max: 10, // max number of clients in pool
  idleTimeoutMillis: 1000, // close & remove clients which have been idle > 1 second
}

module.exports = {
  pg: localPoolConfig
}
