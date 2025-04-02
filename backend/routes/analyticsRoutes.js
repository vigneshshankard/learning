const express = require('express');
const { fetchBasicAnalytics, predictScore } = require('../controllers/analyticsController');
const { authenticateJWT, authorizeRoles } = require('../config/middleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Regular user routes
router.get('/basic', authenticateJWT, fetchBasicAnalytics);

// Premium user routes
router.post('/predict', authenticateJWT, authorizeRoles(ROLES.PREMIUM), predictScore);

module.exports = router;