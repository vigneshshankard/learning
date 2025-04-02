const express = require('express');
const { handleFriendRequest } = require('../controllers/friendController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// User routes
router.post('/friends', authenticateJWT, handleFriendRequest);

module.exports = router;