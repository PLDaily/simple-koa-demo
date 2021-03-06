const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const log4js = require('koa-log4')
const router = require('./routers')
const logger = require('./middleware/logger')
const config = require('./config.js')

const app = new Koa()

log4js.configure({
  // 定义输出方式
  appenders: {
    console: {
      type: 'console'
    },
    http: {
      type: 'dateFile',
      filename: 'log/access.log',
      pattern: '-yyyy-MM-dd',
      compress: true
    },
    emergencies: {
      type: 'file',
      filename: 'log/errors.log'
    },
    error: {
      'type': 'logLevelFilter',
      'level': 'ERROR',
      appender: 'emergencies'
    }
  },
  // 设置以上定义输出方式的执行范围
  categories: {
    console: {
      appenders: ['console'],
      level: 'debug'
    },
    default: {
      appenders: ['http', 'error'],
      level: 'info'
    }
  }
})

app.use(log4js.koaLogger(log4js.getLogger('http')))
app.use(logger())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port)
console.log(`listening on port ${config.port}`)
