const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis = new Redis();
const User = require('../models/User');
const { JWT_SECRET, SALT_ROUNDS, ROLES } = require('../config/constants');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// User registration
async function register(req, res) {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ email, passwordHash, role: ROLES.REGULAR });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// User login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// User logout
async function logout(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    // Add token to blocklist with expiration matching the token's remaining validity
    const decoded = jwt.decode(token);
    const expiration = decoded.exp * 1000 - Date.now();
    await redis.set(`blocklist:${token}`, true, 'PX', expiration);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Forgot Password
async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Store token and expiry in Redis
    await redis.set(`resetToken:${resetToken}`, user.id, 'PX', 3600000);

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Reset Password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const userId = await redis.get(`resetToken:${token}`);
    if (!userId) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = passwordHash;
    await user.save();

    // Invalidate the token
    await redis.del(`resetToken:${token}`);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Social Login
async function socialLogin(req, res) {
  const { provider, token } = req.body;
  try {
    // Verify token with the provider (e.g., Google, Facebook)
    const userInfo = await verifySocialToken(provider, token);
    if (!userInfo) return res.status(400).json({ message: 'Invalid social login token' });

    let user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      user = await User.create({
        email: userInfo.email,
        role: ROLES.REGULAR,
        socialId: userInfo.id,
      });
    }

    const jwtToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Social login successful', token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

async function verifySocialToken(provider, token) {
  // Mock implementation for verifying social login tokens
  // Replace with actual API calls to Google, Facebook, etc.
  if (provider === 'google') {
    // Verify Google token
    return { email: 'user@example.com', id: 'google-id' };
  } else if (provider === 'facebook') {
    // Verify Facebook token
    return { email: 'user@example.com', id: 'facebook-id' };
  }
  return null;
}

module.exports = { register, login, logout, forgotPassword, resetPassword, socialLogin };