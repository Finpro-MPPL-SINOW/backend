const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'user',
      })
      Transaction.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
    }
  }
  Transaction.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.UUID,
      courseId: DataTypes.UUID,
      coursePrice: DataTypes.INTEGER,
      discountPrice: DataTypes.INTEGER,
      taxPrice: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      promoDiscountPercentage: DataTypes.INTEGER,
      taxPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 11,
      },
      paymentUrl: DataTypes.STRING,
      paymentToken: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      paidAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  )
  return Transaction
}
