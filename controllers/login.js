const crypto = require('crypto')
const Event = require('events')
const logger = require('koa-log4').getLogger('login')
const validator = require('validator')
const UserService = require('../services/user')
const redisClient = require('../database/redis')

const login = async (ctx) => {
  const username = validator.trim(ctx.request.body.username).toLowerCase()
  let password = validator.trim(ctx.request.body.password)
  const event = new Event()
  event.on('error', msg => {
    ctx.status = 422
    ctx.body = {
      error: msg
    }
  })
  if ([username, password].some(item => { return item === '' })) {
    event.emit('error', '用户名或密码不能为空')
    return
  }
  try {
    const user = await UserService.findByUserName(username)
    if (!user) {
      event.emit('error', '用户不存在')
      return
    }
    password = crypto.createHash('md5').update(password).digest('hex')
    if (user.password === password) {
      // 16字节随机数，一字节8位，共有2^128种可能性，转化为16进制存储
      const session = crypto.randomBytes(16).toString('hex')
      // 7000s
      redisClient.set(session, user.id, 'EX', 7000)
      ctx.status = 200
      ctx.body = {
        token: session,
        username: user.username
      }
    } else {
      event.emit('error', '密码错误')
      return
    }
  } catch (err) {
    logger.error('Something went wrong:', err)
    event.emit('error', 'mysql服务端错误')
  }
}

module.exports = {
  login
}
