const userService = require('../services/user.js')
let register = async (ctx) => {
  let newUser = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }
  try {
    await userService.create(newUser)
    ctx.session = newUser
    ctx.redirect('/')
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register
}
