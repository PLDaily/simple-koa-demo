const Event = require('events')
const logger = require('koa-log4').getLogger('article')
const validator = require('validator')
const ArticleService = require('../services/article')
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

const get = async (ctx) => {
  const {articleid} = ctx.params
  console.log(articleid)
  const event = new Event()
  event.on('prop_err', msg => {
    ctx.status = 422 // 请求被服务器正确解析，但是包含无效字段
    ctx.body = {
      error: msg
    }
  })
  if (!articleid) {
    event.emit('prop_err', 'token、文章id不能为空')
    return
  }

  try {
    const article = await ArticleService.findAll(articleid)
    if (article) {
      ctx.status = 200
      ctx.body = {
        article: article
      }
    } else {
      event.emit('prop_err', '文章不存在')
      return
    }
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('prop_err', 'mysql服务端错误')
  }
}

const save = async (ctx) => {
  const token = validator.trim(ctx.request.body.token)
  const title = validator.trim(ctx.request.body.title).toLowerCase()
  const content = validator.trim(ctx.request.body.content)
  let userId = 0
  const event = new Event()
  event.on('prop_err', msg => {
    ctx.status = 422 // 请求被服务器正确解析，但是包含无效字段
    ctx.body = {
      error: msg
    }
  })
  if ([token, title, content].some(item => { return item === '' })) {
    event.emit('prop_err', 'token、标题或内容不能为空')
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
      const article = await ArticleService.create({
        title,
        content,
        userId
      })
      if (article) {
        ctx.status = 200
        ctx.body = {
          articleid: article.id
        }
      } else {
        event.emit('prop_err', '文章保存失败')
        return
      }
    } catch (err) {
      logger.error('Something went wrong:', err)
      event.emit('prop_err', 'mysql服务端错误')
    }
  }
}

const remove = async (ctx) => {
  const {token, articleid} = ctx.request.body
  let userId = 0
  const event = new Event()
  event.on('prop_err', msg => {
    ctx.status = 422 // 请求被服务器正确解析，但是包含无效字段
    ctx.body = {
      error: msg
    }
  })
  if ([token, articleid].some(item => { return item === '' })) {
    event.emit('prop_err', 'token、文章id不能为空')
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
      const article = await ArticleService.findById(articleid)
      if (article) {
        if (parseInt(article.userId) === parseInt(userId)) {
          await ArticleService.remove(article.id)
          ctx.status = 200
          ctx.body = {
            articleid: article.id
          }
        } else {
          event.emit('prop_err', '你无权限删除')
          return
        }
      } else {
        event.emit('prop_err', '获取文章失败')
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
  remove,
  get
}
