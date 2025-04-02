const ChatGroup = require('../models/ChatGroup');
const db = require('../config/database');

// Create a chat group
async function createChatGroup(req, res) {
  const { name } = req.body;
  try {
    const group = await ChatGroup.create({
      name,
      createdBy: req.user.id,
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Fetch chat groups for a user
async function fetchChatGroups(req, res) {
  try {
    const groups = await ChatGroup.findAll({ where: { createdBy: req.user.id } });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { createChatGroup, fetchChatGroups };