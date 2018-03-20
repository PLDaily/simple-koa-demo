const sequelize = require('../database/mysql.js')
const User = sequelize.import('./user.js')
const Article = sequelize.import('./article.js')
const ArticleLike = sequelize.import('./articlelike.js')

// 模型关联
// 一个用户可以有多篇文章
User.hasMany(Article, {
  foreignKey: 'user_id',
  targetKey: 'id',
})

// 一篇文章只能有一个作者
Article.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'user'
})

// 多对多改写为一对多
ArticleLike.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

User.hasMany(ArticleLike, {
  foreignKey: 'user_id'
})

Article.hasMany(ArticleLike, {
  foreignKey: 'article_id',
  as: 'articlelikes'
})

ArticleLike.belongsTo(Article, {
  foreignKey: 'article_id',
})

// // 一个用户可以给多篇文章点赞
// User.belongsToMany(Article, {
//   as: 'ArticleLike',
//   through: 'm_article_like',
//   foreignKey: 'user_id',
//   timestamps: false
// })

// // 一篇文章可以被多个用户点赞
// Article.belongsToMany(User, {
//   as: 'ArticleLike',
//   through: 'm_article_like',
//   foreignKey: 'article_id',
//   timestamps: false
// })

// 同步数据
sequelize.sync().then(() => {
  console.log('数据同步完成')
}).catch(err => {
  console.log('数据同步失败')
  console.log(err)
})

module.exports = {
  User,
  Article,
  ArticleLike
}
