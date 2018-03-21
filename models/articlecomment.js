module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ArticleComment', {
    id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'm_article_comment'
  })
}
