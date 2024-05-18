const benefits = require('../seed_data/benefits')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const courseId = await queryInterface.sequelize.query(
      'SELECT id FROM public."Courses"',
    )
    await queryInterface.bulkInsert('Benefits', benefits(courseId[0]), {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Benefits', null, {})
  },
}
