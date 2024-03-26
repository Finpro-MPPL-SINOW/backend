const modules = require('../seed_data/modules')
const chapters = require('../seed_data/chapters')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const courseId = await queryInterface.sequelize.query(
      'SELECT id FROM public."Courses"',
    )

    await queryInterface.bulkInsert('Chapters', chapters(courseId[0]), {})

    const chapterId = await queryInterface.sequelize.query(
      'SELECT id FROM public."Chapters"',
    )
    await queryInterface.bulkInsert('Modules', modules(chapterId[0]), {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Chapters', null, {})
    await queryInterface.bulkDelete('Modules', null, {})
  },
}
