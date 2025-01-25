const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// 发送消息的路由
router.post('/send', chatController.sendMessage);

// 获取聊天历史记录的路由
router.get('/history', chatController.getHistory);

module.exports = router;
