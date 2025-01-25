// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const pool = require('./dbConfig'); // 引入数据库连接池

const app = express();
const PORT = 3001;

// 配置中间件
app.use(cors());
app.use(bodyParser.json());

// 使用聊天路由
app.use('/api/chat', chatRoutes);

// 测试数据库连接
pool.getConnection()
  .then((connection) => {
    console.log('成功连接到 MySQL 数据库');
    connection.release();
  })
  .catch((err) => {
    console.error('无法连接到 MySQL 数据库:', err);
  });

// 启动服务器
app.listen(PORT, () => {
  console.log(`后端服务器正在运行在端口 ${PORT}`);
});
