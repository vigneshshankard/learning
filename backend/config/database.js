const { Sequelize } = require('sequelize');

// For testing, use SQLite in memory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

module.exports = sequelize;