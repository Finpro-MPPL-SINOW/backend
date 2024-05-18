/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const { MyCourse, Transaction, MyModule } = require('../models')
const { Op } = require('sequelize')
require('dotenv').config()

let token = null
let token2 = null
let notifications = null
let myModuleId = null
let lockedMyModuleId = null
let transactionId = null
let courseId = null
let courseId2 = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const loginResponse2 = await request(app).post('/api/v1/auth/login').send({
      email: 'aceng@admin.sinow.com',
      password: '12345678',
    })

    token2 = loginResponse2.body.data.token

    const getCourse = await request(app).get('/api/v1/courses')
    courseId = getCourse.body.data[0].id
    await request(app)
      .get(`/api/v1/user/my-courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    courseId2 = getCourse.body.data[1].id
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

afterAll(async () => {
  try {
    await MyCourse.destroy({
      where: {
        userId: {
          [Op.or]: [1, 2],
        },
      },
    })
  } catch (error) {
    console.log(error)
  }
})

describe('API get data user', () => {
  it('success get data user', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get data user: no token', async () => {
    const response = await request(app).get('/api/v1/user')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API update data user', () => {
  const userData = {
    name: 'John Doe',
    country: 'Indonesia',
    city: 'Jakarta',
  }
  it('success update data user', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(userData)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed update data user: no token', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .field(userData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: phone Number resgisterd on another account', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ phoneNumber: '+6281234567101' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: phone Number is not valid', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ phoneNumber: '812' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API change password user', () => {
  it('success change password user', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed change password user: no token', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .send(data)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: old password not valid', async () => {
    const data = {
      oldPassword: '123456789',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password does not match', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '1234567890',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password less than 8', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345',
      confirmNewPassword: '12345',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password more than 12', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '123456789012345',
      confirmNewPassword: '123456789012345',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get user notification', () => {
  it('success get user notification', async () => {
    const response = await request(app)
      .get('/api/v1/user/notifications')
      .set({
        Authorization: `Bearer ${token}`,
      })
    notifications = response.body.data
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get user notification: no token', async () => {
    const response = await request(app).get('/api/v1/user/notifications')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get notification details by id', () => {
  it('success get notification details by id', async () => {
    const response = await request(app)
      .get(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get notification details by id: no token', async () => {
    const response = await request(app).get(
      `/api/v1/user/notifications/${
        notifications[notifications.length - 1].id
      }`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification details by id: notification not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/notifications/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification details by id: no access', async () => {
    const response = await request(app)
      .get(`/api/v1/user/notifications/${notifications[0].id}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API delete notification by id', () => {
  it('success delete notification by id', async () => {
    const response = await request(app)
      .delete(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete notification by id: no token', async () => {
    const response = await request(app).delete(
      `/api/v1/user/notifications/${
        notifications[notifications.length - 1].id
      }`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification by id: notification not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/user/notifications/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification by id: no access', async () => {
    const response = await request(app)
      .delete(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API create My Course', () => {
  it('success create my course', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  })

  it('failed create my course by id: no token', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}`)
      .send({
        courseId: courseId,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create my course by id: course not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API follow My Course', () => {
  it('success follow my course', async () => {
    const response = await request(app)
      .post(`/api/v1/user/my-courses/${courseId}/follow-course`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed follow my course: course not found', async () => {
    const response = await request(app)
      .post(`/api/v1/user/my-courses/${fakeId}/follow-course`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed follow my course: My Course not found', async () => {
    const response = await request(app)
      .post(`/api/v1/user/my-courses/${fakeId}/follow-course`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed follow my course: No access to course', async () => {
    await request(app)
      .get(`/api/v1/user/my-courses/${courseId2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    const response = await request(app)
      .post('/api/v1/user/my-courses/4/follow-course')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed follow my course: course already followed', async () => {
    const response = await request(app)
      .post(`/api/v1/user/my-courses/${courseId}/follow-course`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API open My Course', () => {
  it('success open my course', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    myModuleId = response.body.data.myCourse.Course.chapters[0].myModules[0].id
    lockedMyModuleId =
      response.body.data.myCourse.Course.chapters[1].myModules[0].id
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})

describe('API get all myCourses', () => {
  it('success get all my courses', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get all my courses: no token', async () => {
    const response = await request(app).get('/api/v1/user/my-courses')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get all my courses: course not found', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses')
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get all my courses: category not valid', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses?category=invalid')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get all my courses: level not valid', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses?level=invalid')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get all my courses: type not valid', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses?type=invalid')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get all my courses: type not valid', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses?progress=invalid')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get myModule', () => {
  it('success get my modules', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${myModuleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('success get locked my modules', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${lockedMyModuleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my module: no token', async () => {
    const response = await request(app).get(
      `/api/v1/user/my-courses/${courseId}/modules/${myModuleId}`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my module: token not valid', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${myModuleId}`)
      .set({
        Authorization: `Bearer ${token}12`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my modules: no relation', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${myModuleId}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my module: course not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${fakeId}/modules/${myModuleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my module: module not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get my module: module is inaccessible', async () => {
    const coursePremium = await request(app)
      .get(`/api/v1/user/my-courses/${courseId2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    const coursePremiumId = coursePremium.body.data.myCourse.Course.id
    const modulePremiumId =
      coursePremium.body.data.myCourse.Course.chapters[0].myModules[2].id
    const response = await request(app)
      .get(
        `/api/v1/user/my-courses/${coursePremiumId}/modules/${modulePremiumId}`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Anda perlu menyelesaikan pembayaran terlebih dahulu untuk mengakses course ini',
    )
  })

  it('failed get my modules: course is not followed', async () => {
    const myCourse = await MyCourse.findOne({
      where: {
        name: 1,
        courseId: 1,
      },
    })

    await myCourse.update({ isFollowing: false })

    const myModule = await MyModule.findOne({
      where: {
        userId: 1,
        status: 'terkunci',
      },
    })

    const response = await request(app)
      .get(`/api/v1/user/my-courses/${courseId}/modules/${myModule.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get myTransaction', () => {
  it('failed get user transaction: no transaction', async () => {
    const response = await request(app)
      .get('/api/v1/user/transaction')
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('success get user transaction', async () => {
    const transaction = await request(app)
      .post('/api/v1/transactions')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        courseId: 4,
      })

    transactionId = transaction.body.data.transactionDetail.id
    const response = await request(app)
      .get('/api/v1/user/transaction')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
  it('failed get user transaction: no token', async () => {
    const response = await request(app).get('/api/v1/user/transaction')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get myTransaction by id', () => {
  it('success get user transaction by id', async () => {
    const response = await request(app)
      .get(`/api/v1/user/transaction/${transactionId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get user transaction by id: transaction not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/transaction/2a48c09f-b1f5-4d4f-8867-29f3d0a9fe46`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get user transaction by id: no access', async () => {
    const response = await request(app)
      .get(`/api/v1/user/transaction/${transactionId}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API delete myTransaction by id', () => {
  it('failed delete user transaction by id: no access', async () => {
    const response = await request(app)
      .delete(`/api/v1/user/transaction/${transactionId}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete user transaction by id: transaction not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/user/transaction/2a48c09f-b1f5-4d4f-8867-29f3d0a9fe46`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete user transaction by id: course already paid', async () => {
    const transaction = await Transaction.findByPk(transactionId)
    transaction.status = 'SUDAH_BAYAR'
    await transaction.save()

    const response = await request(app)
      .delete(`/api/v1/user/transaction/${transactionId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })

  it('success delete user transaction by id', async () => {
    const transaction = await Transaction.findByPk(transactionId)
    transaction.status = 'BELUM_BAYAR'
    await transaction.save()

    const response = await request(app)
      .delete(`/api/v1/user/transaction/${transactionId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})
