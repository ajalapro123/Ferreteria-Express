const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inquiry: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;