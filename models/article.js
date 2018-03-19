module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Article', {
    id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT(11),
      field: 'user_id',
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'm_articles'
  })
}
