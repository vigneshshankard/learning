const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'achievement', 'poll'),
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reposts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  engagementScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  isBoosted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Post;