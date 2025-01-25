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

// 新增删除最早100条记录的方法
exports.deleteFirst100Messages = async (session_id) => {
  try {
    // 使用子查询选择最早的100条记录
    const [result] = await pool.execute(
      `
      DELETE FROM conversation_logs
      WHERE id IN (
        SELECT id FROM (
          SELECT id FROM conversation_logs
          WHERE session_id = ?
          ORDER BY timestamp ASC
          LIMIT 100
        ) AS temp
      )
      `,
      [session_id]
    );

    console.log(`已删除 ${result.affectedRows} 条最早的聊天记录`);
  } catch (error) {
    console.error('删除最早的100条聊天记录时出错:', error);
    throw error;
  }
};
