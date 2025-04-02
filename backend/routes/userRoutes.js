const express = require('express');
const { register, login, logout } = require('../controllers/userController');

const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// User logout
router.post('/logout', logout);

module.exports = router;