const mysql = require('mysql');
const config = require('../config.js')

const connectionPool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((err, connection) => {
      if(err) reject(err)
      connection.query(sql, values, (err, rows) => {
        if(err) reject(err)
        resolve(rows)
        connection.release();
      })
    })
  })
}

let insertData = (table, values) => {
  let sql = `INSERT INTO ?? SET ?`
  return query(sql,[table, values])
}

module.exports = {
  insertData
}