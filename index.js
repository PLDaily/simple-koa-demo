const path = require('path');
const session = require('koa-session');
const views = require('koa-views');
const router = require('./router');
const logger = require('./middleware/logger');
const Koa = require('koa');
const app = new Koa();

app.use(logger());

app.use(views(path.join(__dirname, 'views'), {extension: 'ejs'}));

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
};

app.use(session(CONFIG, app));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('listening on port 3000');