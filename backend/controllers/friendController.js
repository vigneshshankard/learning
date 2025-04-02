const { rateLimit } = require('../services/rateLimiter');
const db = require('../config/database');

// Send or accept friend request
async function handleFriendRequest(req, res) {
  const { friendId } = req.body;
  try {
    const key = `friend_request:${req.user.id}`;
    const allowed = await rateLimit(key, 5, 3600); // Limit to 5 requests per hour

    if (!allowed) {
      return res.status(429).json({ message: 'Friend request limit reached. Try again later.' });
    }

    const existingConnection = await db('connections').where({ user_id: req.user.id, friend_id: friendId }).first();
    if (existingConnection) {
      return res.status(400).json({ message: 'Friend request already sent or accepted.' });
    }

    await db('connections').insert({ user_id: req.user.id, friend_id: friendId, status: 'pending' });
    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { handleFriendRequest };