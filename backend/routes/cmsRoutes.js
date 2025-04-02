const express = require('express');
const { getHierarchy, bulkUpload, getMaterialById, updateMaterial } = require('../controllers/cmsController');
const { authenticateJWT, authorizeRoles } = require('../config/middleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Public routes
router.get('/hierarchy', getHierarchy);
router.get('/:id', getMaterialById);

// Admin routes
router.post('/upload', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), bulkUpload);
router.put('/:id', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), updateMaterial);

module.exports = router;