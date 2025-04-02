const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Subscription = sequelize.define('Subscription', {
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
  planId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'expired'),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastPaymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Subscription;