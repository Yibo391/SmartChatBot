const express = require('express');
const cors = require('cors');
const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

// Routes
const faqRouter = require('./routes/faq');
const chatRouter = require('./routes/chat');

app.use('/api/faq', faqRouter);
app.use('/api/chat', chatRouter);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler - must be last
app.use((req, res) => {
    console.log('404 for path:', req.path);
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
