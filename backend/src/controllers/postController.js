const Post = require('../models/Post');
const aiService = require('../services/aiService');
const scoringService = require('../services/scoringService');

// Generate 5 posts based on topic and context
exports.generate = async (req, res) => {
    try {
        const { topic, context } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });
        
        const postsData = await aiService.generatePosts(topic, context || {});
        
        const preparedPosts = postsData.map(postData => {
            const score = scoringService.calculateEngagementScore(postData.fullContent, postData.hook);
            return {
                topic,
                style: postData.style,
                hook: postData.hook,
                body: postData.body,
                cta: postData.cta,
                hashtags: postData.hashtags,
                fullContent: postData.fullContent,
                engagementScore: score
            };
        });

        res.json({ posts: preparedPosts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate posts' });
    }
};

// Save a post to the database (used when user wants to keep or schedule one)
exports.savePost = async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save post' });
    }
};

// Edit full post manually
exports.editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Regenerate specific section of a draft sent from the frontend
exports.regenerateSection = async (req, res) => {
    try {
        const { post, section } = req.body; // post object, section string ('hook', 'body', 'cta', 'hashtags')
        if (!['hook', 'body', 'cta', 'hashtags'].includes(section)) {
            return res.status(400).json({ error: 'Invalid section' });
        }

        const newText = await aiService.regenerateSection(post, section);
        
        // Return updated section
        res.json({ newText, section });
    } catch (error) {
        res.status(500).json({ error: `Failed to regenerate ${req.body.section}` });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
