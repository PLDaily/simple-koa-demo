const Event = require('events')
const logger = require('koa-log4').getLogger('user')
const ArticleService = require('../services/article')
const UserService = require('../services/user')

const get = async (ctx) => {
  const {userid} = ctx.params
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if (!userid) {
    event.emit('prop_err', '用户id不能为空')
    return
  }
  try {
    const user = await UserService.findById(userid)
    if (!user) {
      event.emit('error', '用户不存在')
      return
    }
    const result = await ArticleService.findUserArticle(userid)
    ctx.status = 200
    ctx.body = {
      articles: result
    }
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('error', 'mysql服务端错误')
  }
}

module.exports = {
  get
}
