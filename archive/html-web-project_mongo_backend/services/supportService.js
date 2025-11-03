const express = require('express');
const router = express.Router();

// Mock support inquiries data
let supportInquiries = [];

// Endpoint to submit a support inquiry
router.post('/inquiry', (req, res) => {
    const { userId, message } = req.body;
    const inquiry = { id: supportInquiries.length + 1, userId, message, status: 'Pending' };
    supportInquiries.push(inquiry);
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
});

// Endpoint to get all support inquiries
router.get('/inquiries', (req, res) => {
    res.json(supportInquiries);
});

// Endpoint to get a specific inquiry by ID
router.get('/inquiry/:id', (req, res) => {
    const inquiry = supportInquiries.find(i => i.id === parseInt(req.params.id));
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
});

// Endpoint to update the status of an inquiry
router.put('/inquiry/:id', (req, res) => {
    const inquiry = supportInquiries.find(i => i.id === parseInt(req.params.id));
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    
    inquiry.status = req.body.status || inquiry.status;
    res.json({ message: 'Inquiry updated successfully', inquiry });
});

module.exports = router;