/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MyCourses', {
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
      isAccessible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isFollowing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      progress: {
        type: Sequelize.STRING,
        defaultValue: 'inProgress',
      },
      progressPercentage: {
        type: Sequelize.INTEGER,
      },
      lastSeen: {
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
    await queryInterface.dropTable('MyCourses')
  },
}
