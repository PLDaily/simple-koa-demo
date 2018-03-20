const models = require('../models')
const Article = models.Article
const User = models.User
const ArticleLike = models.ArticleLike

module.exports = {
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
      include: [{
        model: ArticleLike,
        as: 'articlelikes',
        include: [{
          model: User,
          as: 'user'
        }]
      }, {
        model: User,
        as: 'user'
      }]
    })
    return result
  }
}
