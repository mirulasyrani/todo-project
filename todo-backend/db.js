require('dotenv').config(); // ✅ Load environment variables from .env

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
