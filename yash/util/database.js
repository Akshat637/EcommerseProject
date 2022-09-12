const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-completed', 'root', 'AK_yadav637', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;