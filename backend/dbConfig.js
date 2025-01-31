require('dotenv').config();
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
    
    // Show all tables in database
    pool.query('SHOW TABLES')
      .then(([rows]) => {
        console.log('Database tables:');
        console.log(rows);
      })
      .catch(err => {
        console.error('Error showing tables:', err);
      });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = pool;
