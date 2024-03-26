/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MyModules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
      },
      moduleId: {
        type: Sequelize.UUID,
      },
      chapterId: {
        type: Sequelize.UUID,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'terkunci',
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
    await queryInterface.dropTable('MyModules')
  },
}
