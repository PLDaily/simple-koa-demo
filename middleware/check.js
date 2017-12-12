const checkLogin = async (ctx, next) => {
  if (!ctx.session || !ctx.session.username) {
    ctx.redirect('/login')
  }
  await next()
}

const checkNotLogin = async (ctx, next) => {
  if (ctx.session && ctx.session.username) {
    ctx.redirect('/')
  }
  await next()
}

module.exports = {
  checkLogin,
  checkNotLogin
}
