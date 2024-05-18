const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Benefit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Benefit.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
    }
  }
  Benefit.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      no: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      courseId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Benefit',
    },
  )
  return Benefit
}
