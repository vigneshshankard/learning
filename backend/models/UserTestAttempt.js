const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Exam = require('./Exam');

const UserTestAttempt = sequelize.define('UserTestAttempt', {
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
  examId: {
    type: DataTypes.INTEGER,
    references: {
      model: Exam,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Add indexes
UserTestAttempt.addIndex(['userId']);
UserTestAttempt.addIndex(['examId']);

module.exports = UserTestAttempt;