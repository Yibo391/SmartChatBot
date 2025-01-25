// dbConfig.js
const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',      // MySQL 主机地址
  user: 'yibo',  // 替换为您的 MySQL 用户名
  password: 'Y1b0@Pass!', // 替换为您的 MySQL 密码
  database: 'smartchatbot',  // 将在后续步骤中创建的数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
