const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AnalyticsBasic = sequelize.define('AnalyticsBasic', {
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
  last5Scores: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true,
    validate: {
      isNumbersArray(value) {
        if (value && !value.every(item => typeof item === 'number')) {
          throw new Error('All array elements must be numbers');
        }
      }
    }
  },
  avgAccuracy: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timePerQuestion: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  syllabusCoverage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = AnalyticsBasic;