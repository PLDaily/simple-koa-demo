module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ArticleLike', {
    id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false,
    tableName: 'm_article_like'
  })
}
