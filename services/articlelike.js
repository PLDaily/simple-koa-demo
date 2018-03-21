const models = require('../models')
const ArticleLike = models.ArticleLike

module.exports = {
  async find (user, article) {
    const result = await ArticleLike.find({
      where: {
        user_id: user.id,
        article_id: article.id
      }
    })
    return result
  },
  async create (user, article) {
    const result = await ArticleLike.create({
      user_id: user.id,
      article_id: article.id
    })
    return result
  },
  async remove (user, article) {
    const result = await ArticleLike.destroy({
      where: {
        user_id: user.id,
        article_id: article.id
      }
    })
    return result
  }
}
