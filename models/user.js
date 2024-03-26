const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Auth, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.belongsToMany(models.Course, {
        through: 'MyCourses',
        foreignKey: 'userId',
        otherKey: 'courseId',
        as: 'courses',
      })
      User.belongsToMany(models.Module, {
        through: 'MyModules',
        foreignKey: 'userId',
        otherKey: 'moduleId',
        as: 'modules',
      })
      User.hasMany(models.Notification, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'notifications',
      })
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      photoProfileUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
        defaultValue:
          'https://ik.imagekit.io/vsecvavlp/SINOW%20assets/profile%20picture%20placeholder.jpg?updatedAt=1710817491626',
      },
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  )
  return User
}
