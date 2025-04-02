const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const StudyPlan = sequelize.define('StudyPlan', {
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
  type: {
    type: DataTypes.ENUM('static', 'adaptive'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  syllabusCoverage: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  focusAreas: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = StudyPlan;