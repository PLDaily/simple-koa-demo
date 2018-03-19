const models = require('../models')
const Article = models.Article

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
    const result = Article.findById(article.id).then(item => {
      return item.update(article)
    })
    return result
  }
}
