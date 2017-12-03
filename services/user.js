const userModel = require('../models/user.js')

const user = {
  async create (user) {
    let result = await userModel.create(user)
    return result
  }
}

module.exports = user
