// chatController.js
const axios = require('axios');
const Conversation = require('../models/Conversation');
const pool = require('../dbConfig'); // 引入数据库连接池

// 添加 FAQ 查询功能
const findFAQ = async (question) => {
  try {
    const [rows] = await pool.execute(
      `SELECT answer FROM faq WHERE question LIKE ?`,
      [`%${question}%`]
    );
    return rows.length > 0 ? rows[0].answer : null;
  } catch (error) {
    throw error;
  }
};

// 定义最大消息数
const MAX_MESSAGE_COUNT = 100; // 最大消息数

// 发送消息的控制器
exports.sendMessage = async (req, res) => {
  const { session_id, message } = req.body;

  if (!session_id || !message) {
    return res.status(400).json({ error: '缺少 session_id 或 message' });
  }

  try {
    const timestamp = new Date().toISOString();

    // 记录用户消息
    await Conversation.create({
      session_id,
      sender: 'user',
      message,
      timestamp,
    });

    // 查询 FAQ
    const faqAnswer = await findFAQ(message);
    if (faqAnswer) {
      // 如果匹配到 FAQ，直接回复
      await Conversation.create({
        session_id,
        sender: 'bot',
        message: faqAnswer,
        timestamp,
      });

      // 清理聊天记录，确保不超过100条
      await Conversation.deleteFirst100Messages(session_id);

      return res.json({ session_id, reply: faqAnswer });
    }

    // 获取会话历史
    let history = await Conversation.findAll({ session_id });

    // 构建提示
    let prompt = '';
    history.forEach(entry => {
      prompt += `${entry.sender === 'user' ? 'User' : 'Bot'}: ${entry.message}\n`;
    });
    prompt += `User: ${message}\nBot:`;

    // 调用模型服务
    const response = await axios.post('http://localhost:8000/predict', { 
      text: prompt
    });
    const { reply } = response.data;

    // 记录机器人回复
    await Conversation.create({
      session_id,
      sender: 'bot',
      message: reply,
      timestamp,
    });

    // 检查消息总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS message_count FROM conversation_logs WHERE session_id = ?`,
      [session_id]
    );
    const message_count = countRows[0].message_count;

    if (message_count >= MAX_MESSAGE_COUNT) {
      // 删除最早的100条记录
      await Conversation.deleteFirst100Messages(session_id);
    }

    return res.json({ session_id, reply });
  } catch (error) {
    console.error('发送消息时出错:', error);
    return res.status(500).json({ error: '内部服务器错误' });
  }
};

// 获取聊天历史记录的控制器
exports.getHistory = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: '缺少 session_id' });
  }

  try {
    const history = await Conversation.findAll({ session_id });

    return res.json({
      session_id,
      history: history.map((entry) => ({
        sender: entry.sender,
        message: entry.message,
        timestamp: entry.timestamp, // 根据需要，可以格式化日期
      })),
    });
  } catch (error) {
    console.error('获取历史记录时出错:', error);
    return res.status(500).json({ error: '内部服务器错误' });
  }
};
