const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const StudyPlan = require('./StudyPlan');

const ProgressTracking = sequelize.define('ProgressTracking', {
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
  planId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudyPlan,
      key: 'id',
    },
  },
  completionPercentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  weakTopics: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ProgressTracking;