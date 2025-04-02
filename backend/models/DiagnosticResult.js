const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const DiagnosticResult = sequelize.define('DiagnosticResult', {
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
    unique: true,
  },
  scores: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  weakTopics: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = DiagnosticResult;