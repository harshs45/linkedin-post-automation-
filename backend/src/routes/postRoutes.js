const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/generate', postController.generate);
router.post('/save', postController.savePost); // For saving/scheduling
router.put('/:id', postController.editPost);
router.post('/regenerate-section', postController.regenerateSection);
router.get('/', postController.getPosts);

module.exports = router;
