const Router = require('koa-router')
const router = new Router()
const LoginController = require('../controllers/login')
const RegisterController = require('../controllers/register')
const ArticleController = require('../controllers/article')
const ArticleLikeController = require('../controllers/articlelike')
const ArticleCommentController = require('../controllers/articlecomment')
const IndexController = require('../controllers/index')
const UserController = require('../controllers/user')

// Auth
router.post('/api/login', LoginController.login)
router.post('/api/register', RegisterController.register)

// Article
router.get('/api/article/:articleid', ArticleController.get)
router.post('/api/article', ArticleController.save)
router.delete('/api/article', ArticleController.remove)

// ArticleLike
router.post('/api/article/like', ArticleLikeController.save)
router.delete('/api/article/like', ArticleLikeController.remove)

// ArticleComment
router.post('/api/article/comment', ArticleCommentController.save)
router.delete('/api/article/comment', ArticleCommentController.remove)

// Index
router.get('/api/index', IndexController.index)

// User
router.get('/api/user/:userid', UserController.get)

module.exports = router
