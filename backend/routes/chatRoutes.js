const express = require('express');
const { createChatGroup, fetchChatGroups } = require('../controllers/chatController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// User routes
router.post('/groups', authenticateJWT, createChatGroup);
router.get('/groups', authenticateJWT, fetchChatGroups);

module.exports = router;