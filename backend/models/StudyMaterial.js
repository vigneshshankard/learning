const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Subtopic = require('./Subtopic');
const User = require('./User');

const StudyMaterial = sequelize.define('StudyMaterial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subtopicId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subtopic,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('notes', 'quiz', 'current_affairs'),
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = StudyMaterial;