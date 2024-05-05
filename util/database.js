const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-proj', 'root', 'welcome123', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;