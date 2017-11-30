const Router = require('koa-router');
const router = new Router();
const userController = require('../controllers/user.js')
const checkLogin = require('../middleware/check').checkLogin;
const checkNotLogin = require('../middleware/check').checkNotLogin;

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    message: '首页'
  });
  // if(ctx.session.userId) {
  //   await ctx.render('index', {
  //     message: 'secret'
  //   });
  // }else {
  //   let result
  //   try {
  //     result = await api.getUser(1)
  //   } catch(err) {
  //     console.log(err)
  //   }
  //   res = JSON.parse(JSON.stringify(result))
  //   console.log(res)
  //   ctx.session.userId = res.id
  //   await ctx.render('index', {
  //     message: 'no root'
  //   });
  // }
});

router.get('Auth', '/logout', checkLogin, async (ctx) => {
  await ctx.render('logout', {
    message: '登出'
  });
});

router.post('Auth', '/login', checkNotLogin, async (ctx) => {
  await ctx.render('login', {
    message: '登录'
  });
});

router.get('Auth', '/register', checkNotLogin, async (ctx) => {
  await ctx.render('register', {
    message: '登出'
  });
});

router.post('Auth', '/register', checkNotLogin, userController.register);

module.exports = router
