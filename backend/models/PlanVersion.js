const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const StudyPlan = require('./StudyPlan');

const PlanVersion = sequelize.define('PlanVersion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  planId: {
    type: DataTypes.INTEGER,
    references: {
      model: StudyPlan,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  focusAreas: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.ENUM('user', 'ai'),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['planId', 'version'],
    },
  ],
});

module.exports = PlanVersion;