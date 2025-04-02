const express = require('express');
const { createPost, likePost, addComment, fetchFeed } = require('../controllers/socialController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// Public routes
router.get('/feed', fetchFeed);

// User routes
router.post('/posts', authenticateJWT, createPost);
router.post('/posts/:id/like', authenticateJWT, likePost);
router.post('/posts/:id/comment', authenticateJWT, addComment);

module.exports = router;