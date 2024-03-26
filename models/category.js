const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {}
  Category.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      isPopular: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Category',
    },
  )
  return Category
}
