const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Topic = require('./Topic');

const Subtopic = sequelize.define('Subtopic', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  topicId: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Enforce NOT NULL
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

// Add index
Subtopic.addIndex(['topicId']);

module.exports = Subtopic;