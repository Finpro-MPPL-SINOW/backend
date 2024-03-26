const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // define association here

      Course.hasMany(models.Chapter, {
        foreignKey: 'courseId',
        as: 'chapters',
        onDelete: 'cascade',
        hooks: true,
      })

      Course.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'courseCreator',
      })
      Course.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      })

      Course.hasMany(models.Benefit, {
        foreignKey: 'courseId',
        as: 'benefits',
        onDelete: 'cascade',
      })
    }
  }
  Course.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      videoPreviewUrl: DataTypes.STRING,
      level: DataTypes.STRING,
      rating: DataTypes.FLOAT,
      categoryId: DataTypes.UUID,
      description: DataTypes.TEXT,
      classCode: DataTypes.STRING,
      totalModule: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      type: DataTypes.STRING,
      price: DataTypes.INTEGER,
      promoDiscountPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      courseBy: DataTypes.STRING,
      createdBy: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Course',
    },
  )
  return Course
}
