const models = require('../models')
const ArticleComment = models.ArticleComment

module.exports = {
  async find (user, article, commentid) {
    const result = await ArticleComment.find({
      where: {
        id: commentid,
        user_id: user.id,
        article_id: article.id
      }
    })
    return result
  },
  async create (user, article, content) {
    const result = await ArticleComment.create({
      user_id: user.id,
      article_id: article.id,
      content: content
    })
    return result
  },
  async remove (user, article, commentid) {
    const result = await ArticleComment.destroy({
      where: {
        user_id: user.id,
        article_id: article.id,
        id: commentid
      }
    })
    return result
  }
}
