const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Streak = sequelize.define('Streak', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastActivityDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Streak;