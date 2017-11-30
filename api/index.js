const mysql = require('mysql');
const config = require('../config.js')

class Api {
  constructor() {
    this.connectionPool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });
  }
  login(...value) {
  }
  logout() {
  }
  register(...value) {
    return new Promise(resolve => {
      this.connectionPool.getConnection((err, connection) => {
        if(err) throw err
        connection.query(`INSERT users (username, password) VALUES (?, ?)`, value, (err, rows) => {
          if(err) throw err
          connection.release();
          resolve(rows[0])
        })
      })
    })
  }
  getUser(value) {
    return new Promise(resolve => {
      this.connectionPool.getConnection((err, connection) => {
        if(err) throw err
        connection.query(`SELECT * FROM users WHERE id = ?`, value, (err, rows) => {
          if(err) throw err
          resolve(rows[0])
          connection.release();
        })
      })
    })
  }
}


module.exports = new Api()