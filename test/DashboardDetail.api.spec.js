/* eslint-disable */

const request = require('supertest')
const app = require('../index')
require('dotenv').config()

let token = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'adella@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

describe('API Get Total Course', () => {
  it('success get total course', async () => {
    const response = await request(app)
      .get('/api/v1/dashboard/totalCourse')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil mendapatkan jumlah total course terdaftar',
    )
  })
})
describe('API Get Total Premium Course', () => {
  it('success get total course', async () => {
    const response = await request(app)
      .get('/api/v1/dashboard/totalPremiumCourse')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil mendapatkan jumlah total course premium',
    )
  })
})
describe('API Get Total Active User', () => {
  it('success get total course', async () => {
    const response = await request(app)
      .get('/api/v1/dashboard/totalActiveUser')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil mendapatkan jumlah total pengguna aktif',
    )
  })
})
