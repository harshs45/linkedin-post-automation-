const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    style: { type: String, enum: ['story', 'achievement', 'educational', 'motivational', 'viral'], required: true },
    hook: { type: String, required: true },
    body: { type: String, required: true },
    cta: { type: String, required: true },
    hashtags: { type: String, required: true },
    fullContent: { type: String, required: true },
    engagementScore: {
        hook_strength: { type: Number, min: 1, max: 10 },
        readability: { type: String, enum: ['low', 'medium', 'high'] },
        engagement_potential: { type: Number, min: 1, max: 10 }
    },
    scheduledDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
