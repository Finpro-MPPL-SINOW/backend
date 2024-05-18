const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [
      {
        id: uuidv4(),
        name: 'Fadhlan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Adella',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Grace',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Alif',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Aceng',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Ragil',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Dian',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Farhan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Randika',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Ivan',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    const insertUsers = await queryInterface.bulkInsert('Users', users, {
      returning: true,
    })

    const password = '$2a$10$VOZdAZlTEN6tuhmMU1g1xOJ9OPvlJutSqSa0m1AT7bJC2PZgJRzVa'

    const lastThreeDigit = 100
    const auths = insertUsers.map((user, index) => ({
      id: uuidv4(),
      email: `${user.name}@admin.sinow.com`.toLowerCase(),
      phoneNumber: `+6281234567${lastThreeDigit + index}`,
      password,
      isEmailVerified: true,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert('Auths', auths)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Auths', null, {})
  },
}
