const userModel = require('../models/user.js')

let register = async (ctx) => {
  let newUser = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }
  try {
    let result = await userModel.create(newUser)
    ctx.session = newUser
    ctx.session.userId = result.insertId
    ctx.redirect('/')
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register
}
