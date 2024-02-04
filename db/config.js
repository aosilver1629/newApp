const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'food_reviewer_db',
  password: 'C@ffe1ne1310',
  port: 5432,
});

module.exports = pool;
