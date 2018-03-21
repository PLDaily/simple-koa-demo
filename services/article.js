const models = require('../models')
const Article = models.Article
const User = models.User
const ArticleLike = models.ArticleLike
const ArticleComment = models.ArticleComment

module.exports = {
  async find (user, article, commentid) {
    const result = await ArticleLike.find({
      where: {
        id: commentid,
        user_id: user.id,
        article_id: article.id
      }
    })
    return result
  },
  async create (article) {
    const result = await Article.create(article)
    return result
  },
  async findById (id) {
    const result = await Article.findById(id)
    return result
  },
  async remove (id) {
    const result = await Article.destroy({
      where: {
        id: id
      }
    })
    return result
  },
  async update (article) {
    const result = await Article.findById(article.id).then(item => {
      return item.update(article)
    })
    return result
  },
  async findAll (id) {
    const result = await Article.findAll({
      where: {
        id: id
      },
      attributes: ['id', 'user_id', 'title', 'content'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }, {
        model: ArticleLike,
        as: 'articlelikes',
        attributes: ['user_id'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }]
      }, {
        model: ArticleComment,
        as: 'articlecomments',
        attributes: ['id', 'content'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }]
      }]
    })
    return result
  }
}
