const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Get all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await Conversation.getAllFAQs();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
});

// Get FAQ by ID
router.get('/:id', async (req, res) => {
    try {
        const answer = await Conversation.getFAQAnswer(req.params.id);
        if (answer) {
            res.json({ answer });
        } else {
            res.status(404).json({ error: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQ' });
    }
});

module.exports = router;
