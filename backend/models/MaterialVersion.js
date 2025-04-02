const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const StudyMaterial = require('./StudyMaterial');
const User = require('./User');

const MaterialVersion = sequelize.define('MaterialVersion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  materialId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudyMaterial,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = MaterialVersion;