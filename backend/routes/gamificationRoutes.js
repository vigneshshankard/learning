const express = require('express');
const { fetchBadges, fetchStreak, fetchDailyLeaderboard } = require('../controllers/gamificationController');
const { authenticateJWT } = require('../config/middleware');

const router = express.Router();

// Public routes
router.get('/leaderboard/daily', fetchDailyLeaderboard);

// User routes
router.get('/badges', authenticateJWT, fetchBadges);
router.get('/streak', authenticateJWT, fetchStreak);

module.exports = router;