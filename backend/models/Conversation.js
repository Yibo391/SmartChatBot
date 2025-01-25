// Conversation.js
const pool = require('../dbConfig');

// 插入聊天记录
exports.create = async (data) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO conversation_logs (session_id, sender, message, timestamp)
       VALUES (?, ?, ?, ?)`,
      [data.session_id, data.sender, data.message, data.timestamp]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// 查询聊天记录
exports.findAll = async (conditions) => {
  try {
    const [rows] = await pool.execute(
      `SELECT sender, message, timestamp
       FROM conversation_logs
       WHERE session_id = ?
       ORDER BY timestamp ASC`,
      [conditions.session_id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// 插入 FAQ
exports.insertFAQ = async (data) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO faq (question, answer, category)
       VALUES (?, ?, ?)`,
      [data.question, data.answer, data.category]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};
