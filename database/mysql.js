const Sequelize = require('sequelize')
const config = require('../config.js')

module.exports = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  port: 3306
})
