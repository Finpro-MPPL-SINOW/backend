/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface) {
    const users = [
      {
        id: uuidv4(),
        name: 'Tono',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Joni',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    const insertUsers = await queryInterface.bulkInsert('Users', users, {
      returning: true,
    })

    const password =
      '$2a$10$VOZdAZlTEN6tuhmMU1g1xOJ9OPvlJutSqSa0m1AT7bJC2PZgJRzVa'

    const lastThreeDigit = 200
    const auths = insertUsers.map((user, index) => ({
      id: uuidv4(),
      email: `${user.name}@sinow.com`.toLowerCase(),
      phoneNumber: `+6281234567${lastThreeDigit + index}`,
      password,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
    }))

    await queryInterface.bulkInsert('Auths', auths)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Auths', null, {})
  },
}
