const Event = require('events')
const logger = require('koa-log4').getLogger('index')
const ArticleService = require('../services/article')

const index = async (ctx) => {
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  try {
    const result = await ArticleService.findAll()
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
  index
}
