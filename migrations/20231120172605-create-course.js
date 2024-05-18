/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      videoPreviewUrl: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.FLOAT,
      },
      categoryId: {
        type: Sequelize.UUID,
      },
      description: {
        type: Sequelize.TEXT,
      },
      classCode: {
        type: Sequelize.STRING,
      },
      totalModule: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalDuration: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      promoDiscountPercentage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalUser: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      courseBy: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('Courses')
  },
}
