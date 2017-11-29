const mysql = require('mysql');
global.connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'nmysql'
});

const getUser = (sql, value) => {
  return new Promise(resolve => {
    global.connectionPool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(sql, value, (err, rows) => {
        if(err) throw err
        resolve(rows[0])
        connection.release();
      })
    })
  })
}

// error
// const getUser = async (sql, value) => {
//     let connection = await global.connectionPool.getConnection()
//     let rows = await connection.query(sql, value)
//     return rows[0]
// }


module.exports = {
	getUser
}