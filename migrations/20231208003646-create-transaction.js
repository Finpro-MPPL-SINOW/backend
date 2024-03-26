/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
      },
      courseId: {
        type: Sequelize.UUID,
      },
      coursePrice: {
        type: Sequelize.INTEGER,
      },
      discountPrice: {
        type: Sequelize.INTEGER,
      },
      taxPrice: {
        type: Sequelize.INTEGER,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      promoDiscountPercentage: {
        type: Sequelize.INTEGER,
      },
      taxPercentage: {
        type: Sequelize.INTEGER,
        defaultValue: 11,
      },
      paymentUrl: {
        type: Sequelize.STRING,
      },
      paymentToken: {
        type: Sequelize.STRING,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      paidAt: {
        type: Sequelize.DATE,
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Transactions')
  },
}
