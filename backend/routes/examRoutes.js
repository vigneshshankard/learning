const express = require('express');
const { listExams, createOrUpdateExam, manageQuestions } = require('../controllers/examController');
const { authenticateJWT, authorizeRoles } = require('../config/middleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Public routes
router.get('/', listExams);

// Admin routes
router.post('/', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), createOrUpdateExam);
router.post('/questions', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), manageQuestions);

module.exports = router;