const notificationData = require('../seed_data/notification')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const userId = await queryInterface.sequelize.query(
      'SELECT id FROM public."Users" WHERE role = \'user\'',
    )
    await queryInterface.bulkInsert(
      'Notifications',
      notificationData(userId[0]),
      {},
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Notifications', null, {})
  },
}
