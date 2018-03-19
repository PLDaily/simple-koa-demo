const sequelize = require('../database/mysql.js')
const User = sequelize.import('./user.js')
const Article = sequelize.import('./article.js')

// 模型关联
User.hasMany(Article, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'Article'
})

User.belongsToMany(Article, {
  as: 'ArticleLike',
  through: 'm_article_like',
  foreignKey: 'user_id',
  timestamps: false
})

Article.belongsToMany(User, {
  as: 'ArticleLike',
  through: 'm_article_like',
  foreignKey: 'article_id',
  timestamps: false
})

// 同步数据
sequelize.sync().then(() => {
  console.log('数据同步完成')
}).catch(err => {
  console.log('数据同步失败')
  console.log(err)
})

module.exports = {
  User,
  Article
}
