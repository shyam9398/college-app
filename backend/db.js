const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'college_db',
  password: 'syamalarao99',
  port: 5432,
});

module.exports = pool;