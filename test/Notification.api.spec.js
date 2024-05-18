/* eslint-disable */

const request = require('supertest')
const app = require('../index')
require('dotenv').config()

let adminToken = null
let userToken = null
let notification = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    adminToken = loginResponse.body.data.token

    const loginResponse2 = await request(app).post('/api/v1/auth/login').send({
      email: 'toto@sinow.com',
      password: '12345678',
    })

    userToken = loginResponse2.body.data.token
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

describe('API create notification', () => {
  it('success create notification', async () => {
    const response = await request(app)
      .post('/api/v1/notifications')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        type: 'test',
        title: 'test',
        content: 'test',
      })
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  })

  it('failed create notification: not admin', async () => {
    const response = await request(app)
      .post('/api/v1/notifications')
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .send({
        type: 'test',
        title: 'test',
        content: 'test',
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create notification: no content', async () => {
    const response = await request(app)
      .post('/api/v1/notifications')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        type: 'test',
        title: 'test',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get All Notification', () => {
  it('success get notification', async () => {
    const response = await request(app)
      .get('/api/v1/notifications')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    notification = response.body.data[response.body.data.length - 1]
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get notification: no notification token', async () => {
    const response = await request(app).get('/api/v1/notifications')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification: not admin', async () => {
    const response = await request(app)
      .get('/api/v1/notifications')
      .set({
        Authorization: `Bearer ${userToken}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification: limit not valid', async () => {
    const response = await request(app)
      .get('/api/v1/notifications?limit=abc')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification: notification not found', async () => {
    const response = await request(app)
      .get('/api/v1/notifications?title=asdfjhasdkjfhasdkjh')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification: limit out of range', async () => {
    const response = await request(app)
      .get('/api/v1/notifications?limit=1000')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification: user id not valid', async () => {
    const response = await request(app)
      .get(`/api/v1/notifications?userId=abc`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API update notification', () => {
  it('success update notification', async () => {
    const response = await request(app)
      .put(`/api/v1/notifications/${notification.id}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        type: 'test2',
        title: 'test2',
        content: 'test2',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed update notification: not admin', async () => {
    const response = await request(app)
      .put(`/api/v1/notifications/${notification.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .send({
        type: 'test2',
        title: 'test2',
        content: 'test2',
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update notification: notification not found', async () => {
    const response = await request(app)
      .put(`/api/v1/notifications/${fakeId}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        title: 'test2',
        content: 'test2',
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API update notification by title', () => {
  it('success update notification', async () => {
    const response = await request(app)
      .put(
        '/api/v1/notifications/title/Dapatkan%20potongan%2050%25%20untuk%20kategori%20UI%2FUX',
      )
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        type: 'test',
        title: 'test',
        content: 'test',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed update notification: notification not found', async () => {
    const response = await request(app)
      .put('/api/v1/notifications/title/notification-not-found')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send({
        type: 'test',
        title: 'test',
        content: 'test',
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API delete notification by id', () => {
  it('success delete notification', async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/${notification.id}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete notification: not admin', async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/${notification.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification: notification not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/${fakeId}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API delete notification by title', () => {
  it('success delete notification', async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/title/test`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete notification: not admin', async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/title/test`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification: notification not found', async () => {
    const response = await request(app)
      .delete('/api/v1/notifications/title/testasdklfnadls')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})
