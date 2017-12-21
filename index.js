const path = require('path')
const session = require('koa-session')
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')
const router = require('./routers')
const logger = require('./middleware/logger')
const config = require('./config.js')
const Koa = require('koa')
const app = new Koa()

app.use(logger())
app.use(bodyParser())
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: false
})

app.keys = ['some secret hurr']

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false
}

app.use(session(CONFIG, app))

app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port)
console.log(`listening on port ${config.port}`)
