const AdminAuditLog = require('../models/AdminAuditLog');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { parseCSV } = require('../utils/csvParser');
const Redis = require('ioredis');
const redis = new Redis();
const { body, query, param, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// File to store API keys
const apiKeysFilePath = path.join(__dirname, '../config/socialLoginKeys.json');

// Middleware for input validation
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// List users with filters
const listUsers = [
  validate([
    query('role').optional().isString().withMessage('Role must be a string'),
    query('email').optional().isEmail().withMessage('Invalid email format'),
  ]),
  async (req, res) => {
    try {
      const { role, email } = req.query;
      const filters = {};
      if (role) filters.role = role;
      if (email) filters.email = email;

      const users = await User.findAll({ where: filters });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
];

// Change user role
const changeUserRole = [
  validate([
    param('id').isInt().withMessage('User ID must be an integer'),
    body('role').isString().withMessage('Role must be a string'),
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.role = role;
      await user.save();

      await AdminAuditLog.create({
        adminId: req.user.id,
        action: `changed_role_to_${role}`,
        targetType: 'user',
        targetId: id,
      });

      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
];

// Bulk upload study materials
async function bulkUpload(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const materials = await parseCSV(file.path);
    // Logic to save materials to the database

    await AdminAuditLog.create({
      adminId: req.user.id,
      action: 'bulk_uploaded_study_materials',
      targetType: 'content',
    });

    res.status(201).json({ message: 'Bulk upload successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Broadcast notifications to all users
async function broadcastNotification(req, res) {
  const { message } = req.body;
  try {
    // Logic to send notifications to all users
    await Notification.create({ message, type: 'broadcast' });
    res.status(200).json({ message: 'Notification broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Export data as CSV
async function exportData(req, res) {
  const { type } = req.query; // e.g., 'exams', 'users'
  try {
    let data;
    if (type === 'exams') {
      data = await Exam.findAll();
    } else if (type === 'users') {
      data = await User.findAll();
    } else {
      return res.status(400).json({ message: 'Invalid data type' });
    }

    const csvData = parseCSV(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}.csv`);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Manage cache (clear specific or all caches)
async function clearCache(req, res) {
  const { key } = req.body;
  try {
    if (key) {
      await redis.del(key);
    } else {
      await redis.flushall();
    }
    res.status(200).json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update social login API keys
const updateSocialLoginKeys = [
  validate([
    body('platform').isIn(['google', 'facebook']).withMessage('Platform must be either google or facebook'),
    body('apiKey').isString().withMessage('API key must be a string'),
  ]),
  async (req, res) => {
    try {
      const { platform, apiKey } = req.body;

      // Read existing keys
      let apiKeys = {};
      if (fs.existsSync(apiKeysFilePath)) {
        const data = fs.readFileSync(apiKeysFilePath);
        apiKeys = JSON.parse(data);
      }

      // Update the key for the specified platform
      apiKeys[platform] = apiKey;

      // Save the updated keys back to the file
      fs.writeFileSync(apiKeysFilePath, JSON.stringify(apiKeys, null, 2));

      res.status(200).json({ message: `${platform} API key updated successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
];

module.exports = { listUsers, changeUserRole, bulkUpload, broadcastNotification, exportData, clearCache, updateSocialLoginKeys };