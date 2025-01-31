// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const faqRoutes = require('./routes/faq'); // Add this line
const pool = require('./dbConfig'); // Import database pool

const app = express();
const PORT = 3001;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Use chat routes
app.use('/api/chat', chatRoutes);
app.use('/api/faq', faqRoutes); // Add this line

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch((err) => {
    console.error('Unable to connect to MySQL database:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
