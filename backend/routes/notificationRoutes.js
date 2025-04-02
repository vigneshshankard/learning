const express = require('express');
const { fetchNotifications, updatePreferences } = require('../controllers/notificationController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// User routes
router.get('/', authenticateJWT, fetchNotifications);
router.put('/preferences', authenticateJWT, updatePreferences);

module.exports = router;