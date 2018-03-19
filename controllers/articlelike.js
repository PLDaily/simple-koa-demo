const Event = require('events')
const logger = require('koa-log4').getLogger('articlelike')
const validator = require('validator')
const ArticleLikeService = require('../service/articlelike')
const ArticleService = require('../service/article')
const UserService = require('../service/user')
const redisClient = require('../database/redis')

const getUid = token => {
  return new Promise((resolve, reject) => {
    redisClient.get(token, function (err, userId) {
      if (err) {
        reject(err)
      } else {
        resolve(userId)
      }
    })
  })
}

const save = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const articleid = validator.trim(ctx.request.body.articleid)
  let userId = 0
  const event = new Event()
  event.on('prop_err', msg => {
    ctx.status = 422 // 请求被服务器正确解析，但是包含无效字段
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid].some(item => { return item === '' })) {
    event.emit('prop_err', 'token或文章id不能为空')
    return
  }
  try {
    userId = await getUid(token)
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('prop_err', 'redis服务端错误')
    return
  }
  if (!userId) {
    event.emit('prop_err', 'token失效，请重新登录')
  } else {
    try {
      const user = await UserService.findById(userId)
      const article = await ArticleService.findById(articleid)
      const result = await ArticleLikeService.create(user, article)
      if (result) {
        ctx.status = 200
        ctx.body = {
          articleid: article.id
        }
      } else {
        event.emit('prop_err', '点赞失败')
        return
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('prop_err', 'mysql服务端错误')
    }
  }
}

const remove = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const articleid = validator.trim(ctx.request.body.articleid)
  let userId = 0
  const event = new Event()
  event.on('prop_err', msg => {
    ctx.status = 422 // 请求被服务器正确解析，但是包含无效字段
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid].some(item => { return item === '' })) {
    event.emit('prop_err', 'token或文章id不能为空')
    return
  }
  try {
    userId = await getUid(token)
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('prop_err', 'redis服务端错误')
    return
  }
  if (!userId) {
    event.emit('prop_err', 'token失效，请重新登录')
  } else {
    try {
      const user = await UserService.findById(userId)
      const article = await ArticleService.findById(articleid)
      const result = await ArticleLikeService.remove(user, article)
      if (result) {
        ctx.status = 200
        ctx.body = {
          articleid: article.id
        }
      } else {
        event.emit('prop_err', '取消点赞失败')
        return
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('prop_err', 'mysql服务端错误')
    }
  }
}

module.exports = {
  save,
  remove
}
