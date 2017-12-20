const userModel = require('../models/user.js')

let logout = async (ctx) => {
  ctx.session = null
  ctx.redirect('/')
}

let login = async (ctx) => {
  let user = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }
  try {
    let result = await userModel.signIn(user)
    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
      ctx.session = result
      ctx.session.userId = result.id
      ctx.redirect('/')
    } else {
      result = null
      ctx.redirect('/login')
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  logout,
  login
}
