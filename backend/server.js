// server.js
const express = require('express');
const cors = require('cors');
const app = require('./app');
const pool = require('./dbConfig');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('\nAvailable routes:');
            console.log('GET    /api/faq      - Get all FAQs');
            console.log('GET    /api/faq/:id  - Get FAQ by ID');
            console.log('GET    /api/test     - Test API');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
