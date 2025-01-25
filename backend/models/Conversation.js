// Conversation.js
const pool = require('../dbConfig');

// 格式化日期为 'YYYY-MM-DD HH:MM:SS'
const formatDate = (date) => {
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

// 插入聊天记录
exports.create = async (data) => {
  try {
    const formattedTimestamp = formatDate(new Date(data.timestamp));
    const [result] = await pool.execute(
      `INSERT INTO conversation_logs (session_id, sender, message, timestamp)
       VALUES (?, ?, ?, ?)`,
      [data.session_id, data.sender, data.message, formattedTimestamp]
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
