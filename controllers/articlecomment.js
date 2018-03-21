const Event = require('events')
const logger = require('koa-log4').getLogger('articlelike')
const validator = require('validator')
const ArticleCommentService = require('../services/articlecomment')
const ArticleService = require('../services/article')
const UserService = require('../services/user')
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

const save = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const articleid = validator.trim(ctx.request.body.articleid)
  const content = validator.trim(ctx.request.body.content)
  let userid = 0
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid, content].some(item => { return item === '' })) {
    event.emit('error', 'token、文章id或评论内容不能为空')
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
      const user = await UserService.findById(userid)
      if (!user) {
        event.emit('error', '用户不存在')
        return
      }
      const article = await ArticleService.findById(articleid)
      if (!article) {
        event.emit('error', '文章不存在')
        return
      }
      const result = await ArticleCommentService.create(user, article, content)
      ctx.status = 200
      ctx.body = {
        articleid: article.id,
        commentid: result.id
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('error', 'mysql服务端错误')
    }
  }
}

const remove = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const articleid = validator.trim(ctx.request.body.articleid)
  const commentid = validator.trim(ctx.request.body.commentid)
  let userid = 0
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid, commentid].some(item => { return item === '' })) {
    event.emit('error', 'token、文章id或评论id不能为空')
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
      const user = await UserService.findById(userid)
      if (!user) {
        event.emit('error', '用户不存在')
        return
      }
      const article = await ArticleService.findById(articleid)
      if (!article) {
        event.emit('error', '文章不存在')
        return
      }
      const result = await ArticleCommentService.find(user, article, commentid)
      if (result) {
        await ArticleCommentService.remove(user, article, commentid)
        ctx.status = 200
        ctx.body = {
          articleid: article.id,
          commentid: result.id
        }
      } else {
        event.emit('error', '评论不存在')
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
  remove
}
