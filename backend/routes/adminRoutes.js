const express = require('express');
const { listUsers, changeUserRole, bulkUpload, broadcastNotification, exportData, clearCache, updateSocialLoginKeys } = require('../controllers/adminController');
const { authenticateJWT, checkSuperAdmin, authorizeRoles } = require('../config/middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { ROLES } = require('../config/constants');

const router = express.Router();

// Admin routes
router.get('/users', authenticateJWT, checkSuperAdmin, listUsers);
router.put('/users/:id/role', authenticateJWT, checkSuperAdmin, changeUserRole);
router.post('/content/bulk-upload', authenticateJWT, checkSuperAdmin, upload.single('file'), bulkUpload);

// Broadcast notifications
router.post('/broadcast', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), broadcastNotification);

// Export data as CSV
router.get('/export', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), exportData);

// Clear cache
router.post('/clear-cache', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), clearCache);

// Update social login API keys
router.put('/social-login-keys', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), updateSocialLoginKeys);

// Route to update social login API keys
router.post('/update-social-login-keys', authenticateAdmin, updateSocialLoginKeys);

module.exports = router;