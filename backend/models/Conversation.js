const pool = require('../dbConfig');

// Format date to 'YYYY-MM-DD HH:MM:SS'
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

class Conversation {
  // Insert chat message
  static async create(data) {
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
  }

  // Query chat history
  static async findAll(conditions) {
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
  }

  // Insert FAQ
  static async insertFAQ(data) {
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
  }

  // Delete oldest 100 messages
  static async deleteFirst100Messages(session_id) {
    try {
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

      console.log(`Deleted ${result.affectedRows} oldest chat messages`);
    } catch (error) {
      console.error('Error deleting oldest 100 chat messages:', error);
      throw error;
    }
  }

  // Get all FAQ questions with tags
  static async getAllFAQs() {
    try {
      console.log('Attempting to fetch FAQs from database...');
      const [rows] = await pool.execute(
        `SELECT id, question, answer, category, tags 
         FROM faq 
         ORDER BY category, id`
      );
      console.log(`Successfully fetched ${rows.length} FAQs`);
      console.log('First FAQ:', rows[0]); // Debug log
      return rows;
    } catch (error) {
      console.error('Database error in getAllFAQs:', error);
      throw error;
    }
  }

  // Get FAQ by tag
  static async getFAQsByTag(tag) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, question, answer, category, tags 
         FROM faq
         WHERE tags LIKE ?
         ORDER BY category, id`,
        [`%${tag}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get FAQ answer by question ID
  static async getFAQAnswer(questionId) {
    try {
      const [rows] = await pool.execute(
        `SELECT answer 
         FROM faq 
         WHERE id = ?`,
        [questionId]
      );
      return rows[0]?.answer || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Conversation;
