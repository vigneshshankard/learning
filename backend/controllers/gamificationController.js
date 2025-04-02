const Badge = require('../models/Badge');
const Streak = require('../models/Streak');
const Redis = require('ioredis');
const redis = new Redis();

// Fetch user badges
async function fetchBadges(req, res) {
  const { userId } = req.user;
  try {
    const badges = await Badge.findAll({ where: { userId } });
    res.status(200).json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Fetch current streak
async function fetchStreak(req, res) {
  const { userId } = req.user;
  try {
    const streak = await Streak.findOne({ where: { userId } });
    if (!streak) return res.status(404).json({ message: 'No streak data found' });

    res.status(200).json(streak);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update leaderboard
async function updateLeaderboard(userId, points) {
  try {
    await redis.zAdd('leaderboard:daily', { score: points, value: userId.toString() });
  } catch (error) {
    console.error('Failed to update leaderboard:', error);
  }
}

// Fetch daily leaderboard
async function fetchDailyLeaderboard(req, res) {
  try {
    const leaderboard = await redis.zRangeWithScores('leaderboard:daily', 0, -1, { REV: true });
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { fetchBadges, fetchStreak, updateLeaderboard, fetchDailyLeaderboard };