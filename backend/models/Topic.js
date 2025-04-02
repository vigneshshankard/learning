const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Subject = require('./Subject');

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Topic;