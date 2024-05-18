const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MyModule extends Model {
    static associate(models) {
      // define association here
      MyModule.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'user',
      })
      MyModule.belongsTo(models.Module, {
        foreignKey: {
          name: 'moduleId',
          allowNull: false,
        },
        as: 'moduleData',
      })
      MyModule.belongsTo(models.Chapter, {
        foreignKey: {
          name: 'chapterId',
          allowNull: false,
        },
        as: 'chapter',
      })
    }
  }
  MyModule.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.UUID,
      moduleId: DataTypes.UUID,
      chapterId: DataTypes.UUID,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'terkunci',
      },
    },
    {
      sequelize,
      modelName: 'MyModule',
    },
  )
  return MyModule
}
