const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from Neon / Railway
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;