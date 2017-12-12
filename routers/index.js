const Router = require('koa-router')
const router = new Router()
const loginController = require('../controllers/login.js')
const registerController = require('../controllers/register.js')
const checkLogin = require('../middleware/check').checkLogin
const checkNotLogin = require('../middleware/check').checkNotLogin

// Index
router.get('/', checkLogin, async (ctx, next) => {
  await ctx.render('index', {
    message: '首页'
  })
})

// Auth
router.get('Auth', '/login', checkNotLogin, async (ctx) => {
  await ctx.render('login', {
    message: '登录'
  })
})
router.post('Auth', '/login', loginController.login)

router.get('Auth', '/logout', checkLogin, loginController.logout)

router.get('Auth', '/register', checkNotLogin, async (ctx) => {
  await ctx.render('register', {
    message: '注册'
  })
})
router.post('Auth', '/register', registerController.register)

module.exports = router
