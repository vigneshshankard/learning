const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Exam = require('./Exam');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  examId: {
    type: DataTypes.INTEGER,
    references: {
      model: Exam,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.CHAR(1),
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
  },
});

module.exports = Question;