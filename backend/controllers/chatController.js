// chatController.js
const axios = require('axios');
const Conversation = require('../models/Conversation');

exports.sendMessage = async (req, res) => {
  const { session_id, message } = req.body;

  if (!session_id || !message) {
    return res.status(400).json({ error: 'Missing session_id or message' });
  }

  try {
    const timestamp = new Date();
    
    // Record user message
    await Conversation.create({
      session_id,
      sender: 'user',
      message,
      timestamp,
    });

    // Call Ollama API directly
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "deepseek-r1:7b",
      prompt: message,
      stream: false
    });

    const modelReply = ollamaResponse.data.response;

    // Record bot response
    await Conversation.create({
      session_id,
      sender: 'bot',
      message: modelReply,
      timestamp,
    });

    return res.json({ session_id, reply: modelReply });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取聊天历史记录的控制器
exports.getHistory = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
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
    console.error('Error getting history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
