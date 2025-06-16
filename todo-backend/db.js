// db.js
console.log("Connecting to:", process.env.DATABASE_URL);
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // 👈 explicitly disable SSL
});

module.exports = pool;
