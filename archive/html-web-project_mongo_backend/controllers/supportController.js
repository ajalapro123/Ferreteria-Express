const express = require('express');
const router = express.Router();
const supportService = require('../services/supportService');

// Get FAQs
router.get('/faqs', async (req, res) => {
    try {
        const faqs = await supportService.getFAQs();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving FAQs', error });
    }
});

// Submit a support inquiry
router.post('/inquiry', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const inquiry = await supportService.submitInquiry({ name, email, message });
        res.status(201).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting inquiry', error });
    }
});

module.exports = router;