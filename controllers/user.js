const userService = require('../services/user.js')
let register = async (ctx) => {
  let result = {
    success: true,
    message: '',
    data: null,
    code: 200
  }
  try {
    await userService.create({
      username: 'pcd333',
      password: '1234'
    })
    ctx.body = result
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register
}
