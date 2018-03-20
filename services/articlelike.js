const models = require('../models')
const ArticleLike = models.ArticleLike

module.exports = {
  async create (user, article) {
    console.log(user.id)
    console.log(article.id)
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
