const db = require('../database/mysql.js')

const user = {
  async create (values) {
    let result = await db.insertData('users', values)
    return result
  },
  async signIn (values) {
    let result = await db.selectData('users', values)
    return result
  }
}

module.exports = user
