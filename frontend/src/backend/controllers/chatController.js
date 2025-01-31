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

    // Format thinking process more explicitly
    const thinking = [
      `1. Input Analysis: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      "2. Context Processing: Analyzing message context",
      "3. Knowledge Retrieval: Searching relevant information",
      "4. Response Generation: Formulating coherent reply",
      "5. Output Formatting: Structuring final response"
    ].join('\n');

    const modelReply = `<think>${thinking}</think>\n${ollamaResponse.data.response}`;
    console.log('Debug - Full model reply:', modelReply);

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
        timestamp: entry.timestamp, // Can be formatted as needed
      })),
    });
  } catch (error) {
    console.error('Error getting history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
