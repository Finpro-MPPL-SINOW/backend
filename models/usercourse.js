const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MyCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MyCourse.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      MyCourse.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
    }
  }
  MyCourse.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.UUID,
      courseId: DataTypes.UUID,
      isAccessible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isFollowing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastSeen: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      progress: {
        type: DataTypes.STRING,
        defaultValue: 'inProgress',
      },
      progressPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (myCourse) => {
          const course = await myCourse.getCourse()

          await course.update({
            totalUser: course.totalUser + 1,
          })
        },
        beforeDestroy: async (myCourse) => {
          const course = await myCourse.getCourse()

          await course.update({
            totalUser: course.totalUser - 1,
          })
        },
      },
      sequelize,
      modelName: 'MyCourse',
    },
  )
  return MyCourse
}
