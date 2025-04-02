const express = require('express');
const { subscribe, cancelSubscription } = require('../controllers/billingController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// User routes
router.post('/subscribe', authenticateJWT, subscribe);
router.post('/cancel', authenticateJWT, cancelSubscription);

module.exports = router;