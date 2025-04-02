const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { ROLES } = require('../config/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    defaultValue: ROLES.REGULAR,
  },
  subscriptionStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  monthlyTestCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  mfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Encrypt password before saving
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;