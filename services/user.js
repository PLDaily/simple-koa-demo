const models = require('../models')
const User = models.User

module.exports = {
  async create (user) {
    const result = await User.create(user)
    return result
  },
  async findByUserName (username) {
    const result = await User.find({
      where: {
        username: username
      }
    })
    return result
  },
  async findById (id) {
    const result = await User.findById(id)
    return result
  }
}
