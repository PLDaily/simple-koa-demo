const Router = require('koa-router');
const api = require('../api')
const router = new Router();
const checkLogin = require('../middleware/check').checkLogin;
const checkNotLogin = require('../middleware/check').checkNotLogin;

router.get('/', async (ctx, next) => {
  if(ctx.session.userId) {
    await ctx.render('index', {
      message: 'secret'
    });
  }else {
    let result
    try {
      result = await api.getUser(`SELECT * FROM users WHERE id = ?`, 1)
    } catch(err) {
      console.log(err)
    }
    res = JSON.parse(JSON.stringify(result))
    console.log(res)
    ctx.session.userId = res.id
    await ctx.render('index', {
      message: 'no root'
    });
  }
});

router.get('Auth', '/logout', checkLogin, async (ctx) => {
  await ctx.render('logout', {
    message: '登出'
  });
});

router.get('Auth', '/login', checkNotLogin, async (ctx, next) => {
  await ctx.render('login', {
    message: '登录'
  });
});

router.get('Auth', '/register', checkNotLogin, async (ctx, next) => {
  await ctx.render('register', {
    message: '登出'
  });
});

module.exports = router
