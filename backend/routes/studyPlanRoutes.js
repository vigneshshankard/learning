const express = require('express');
const { submitDiagnostic, generateStudyPlan, fetchStudyPlan, adjustStaticPlan, triggerAIUpdate } = require('../controllers/studyPlanController');
const { authenticateJWT, authorizeRoles } = require('../config/middleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Public routes
router.post('/diagnostic', authenticateJWT, submitDiagnostic);

// Regular and Premium routes
router.post('/generate', authenticateJWT, generateStudyPlan);
router.get('/:userId', authenticateJWT, fetchStudyPlan);
router.put('/adjust', authenticateJWT, authorizeRoles(ROLES.REGULAR), adjustStaticPlan);

// Premium-only routes
router.post('/ai-update', authenticateJWT, authorizeRoles(ROLES.PREMIUM), triggerAIUpdate);

module.exports = router;