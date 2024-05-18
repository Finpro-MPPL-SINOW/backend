const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      // define association here
      Module.belongsToMany(models.User, {
        through: 'MyModules',
        foreignKey: 'moduleId',
        otherKey: 'userId',
        as: 'users',
      })
      Module.belongsTo(models.Chapter, {
        foreignKey: {
          name: 'chapterId',
          allowNull: false,
        },
        as: 'chapter',
        onDelete: 'cascade',
      })
    }
  }
  Module.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      no: DataTypes.INTEGER,
      videoUrl: DataTypes.STRING,
      chapterId: DataTypes.UUID,
      duration: DataTypes.INTEGER,
    },
    {
      hooks: {
        afterCreate: async (module) => {
          const chapter = await module.getChapter()
          const course = await chapter.getCourse()

          await chapter.update({
            totalDuration: chapter.totalDuration + module.duration,
          })

          await course.update({
            totalModule: course.totalModule + 1,
            totalDuration: course.totalDuration + module.duration,
          })
        },
        afterBulkCreate: async (modules) => {
          /* eslint-disable no-await-in-loop, no-restricted-syntax */
          for (const module of modules) {
            const chapter = await module.getChapter()
            const course = await chapter.getCourse()

            await chapter.update({
              totalDuration: chapter.totalDuration + module.duration,
            })

            await course.update({
              totalModule: course.totalModule + 1,
              totalDuration: course.totalDuration + module.duration,
            })
          }
        },
        afterUpdate: async (module) => {
          const chapter = await module.getChapter()
          const course = await chapter.getCourse()

          const totalModuleDuration = await Module.sum('duration', {
            where: {
              chapterId: module.chapterId,
            },
          })

          await chapter.update({
            totalDuration: totalModuleDuration,
          })

          await chapter.reload()

          const allChapters = await course.getChapters()

          await course.update({
            totalDuration: allChapters.reduce(
              (total, chapterItem) => total + chapterItem.totalDuration,
              0,
            ),
          })
        },
        beforeDestroy: async (module) => {
          const chapter = await module.getChapter()

          const course = await chapter.getCourse()

          await chapter.update({
            totalDuration: chapter.totalDuration - module.duration,
          })
          await course.update({
            totalModule: course.totalModule - 1,
            totalDuration: course.totalDuration - module.duration,
          })
        },
        beforeBulkDestroy: async (modules) => {
          for (const module of modules) {
            const chapter = await module.getChapter()

            const course = await chapter.getCourse()

            await chapter.update({
              totalDuration: chapter.totalDuration - module.duration,
            })

            await course.update({
              totalModule: course.totalModule - 1,
              totalDuration: course.totalDuration - module.duration,
            })
          }
        },
      },
      sequelize,
      modelName: 'Module',
    },
  )
  return Module
}
