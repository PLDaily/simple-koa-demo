const userModel = require('../models/user.js')

const user = {
  async create (user) {
    let result = await userModel.create(user)
    return result
  },
  async signIn (user) {
    let result = await userModel.signIn(user)
    return result
  }
}

module.exports = user
