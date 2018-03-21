const Event = require('events')
const logger = require('koa-log4').getLogger('article')
const validator = require('validator')
const ArticleService = require('../services/article')
const redisClient = require('../database/redis')

const getUid = token => {
  return new Promise((resolve, reject) => {
    redisClient.get(token, function (err, userid) {
      if (err) {
        reject(err)
      } else {
        resolve(userid)
      }
    })
  })
}

const get = async (ctx) => {
  const {articleid} = ctx.params
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if (!articleid) {
    event.emit('prop_err', '文章id不能为空')
    return
  }
  try {
    const article = await ArticleService.findArticleDetail(articleid)
    if (article) {
      ctx.status = 200
      ctx.body = {
        article: article
      }
    } else {
      event.emit('error', '文章不存在')
      return
    }
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('error', 'mysql服务端错误')
  }
}

const save = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const title = validator.trim(ctx.request.body.title).toLowerCase()
  const content = validator.trim(ctx.request.body.content)
  let userid = 0
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if ([token, title, content].some(item => { return item === '' })) {
    event.emit('error', 'token、标题或内容不能为空')
    return
  }
  try {
    userid = await getUid(token)
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('error', 'redis服务端错误')
    return
  }
  if (!userid) {
    event.emit('error', 'token失效，请重新登录')
  } else {
    try {
      const article = await ArticleService.create({
        title,
        content,
        userid
      })
      ctx.status = 200
      ctx.body = {
        articleid: article.id
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('error', 'mysql服务端错误')
    }
  }
}

const remove = async (ctx) => {
  const {token, articleid} = ctx.request.body
  let userid = 0
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid].some(item => { return item === '' })) {
    event.emit('error', 'token、文章id不能为空')
    return
  }
  try {
    userid = await getUid(token)
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('error', 'redis服务端错误')
    return
  }

  if (!userid) {
    event.emit('error', 'token失效，请重新登录')
  } else {
    try {
      const article = await ArticleService.findById(articleid)
      if (article) {
        if (parseInt(article.userid) === parseInt(userid)) {
          await ArticleService.remove(article.id)
          ctx.status = 200
          ctx.body = {
            articleid: article.id
          }
        } else {
          event.emit('error', '你无权限删除')
          return
        }
      } else {
        event.emit('error', '获取文章失败')
        return
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('error', 'mysql服务端错误')
    }
  }
}

module.exports = {
  save,
  remove,
  get
}
