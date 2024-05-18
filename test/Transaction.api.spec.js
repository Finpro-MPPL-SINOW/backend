/* eslint-disable */
const request = require('supertest')
const { Transaction, MyCourse } = require('../models')
const app = require('../index')
const generateSHA512 = require('../utils/generateSHA512')
require('dotenv').config()

let token = null
let course = null
let freeCourse = null
let transaction = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const premiumCourseResponse = await request(app).get(
      '/api/v1/courses?type=premium',
    )

    course =
      premiumCourseResponse.body.data[
        premiumCourseResponse.body.data.length - 1
      ]

    const freeCourseResponse = await request(app).get(
      '/api/v1/courses?type=gratis',
    )

    freeCourse =
      freeCourseResponse.body.data[freeCourseResponse.body.data.length - 1]
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

afterAll(async () => {
  try {
    await Transaction.destroy({
      where: {
        id: transaction.id,
      },
    })
  } catch (error) {
    console.log(error)
  }
})

describe('API get all transaction before create', () => {
  it('failed get all transaction: no transaction', async () => {
    const response = await request(app)
      .get('/api/v1/transactions')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API create transaction', () => {
  it('success create transaction', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: course.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    transaction = response.body.data.transactionDetail

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  })

  it('failed create transaction: course not found', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: fakeId,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create transaction: free course', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: freeCourse.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create transaction: already paid', async () => {
    const myCourse = await MyCourse.findOne({
      where: {
        courseId: course.id,
      },
    })

    await myCourse.update({
      isAccessible: true,
    })

    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: course.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')

    await myCourse.update({
      isAccessible: false,
    })
  })
})

describe('API get all transaction', () => {
  it('success get all transaction', async () => {
    const response = await request(app)
      .get('/api/v1/transactions')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})

describe('API get transaction by id', () => {
  it('success get detail transaction', async () => {
    const response = await request(app)
      .get(`/api/v1/transactions/${transaction.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get detail transaction: transaction not found', async () => {
    const response = await request(app)
      .get(`/api/v1/transactions/2a48c09f-b1f5-4d4f-8867-29f3d0a9fe46`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API callback payment', () => {
  it('failed callback payment: request body not valid', async () => {
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Semua field harus diisi')
  })

  it('failed callback payment: fraud status not accept', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'deny',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Transaksi gagal: terdeteksi sebagai fraud',
    )
  })

  it('failed callback payment: signature key not valid', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }1`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Signature key tidak sesuai')
  })

  it('failed callback payment: transaction not found', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: 'f730f6e1-dfbe-41b7-9101-87435f4cff92',
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Transaksi tidak ditemukan')
  })

  it('failed callback payment: transaction expired', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'expire',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Transaksi kadaluarsa, silahkan buat transaksi baru',
    )
  })

  it('failed callback payment: transaction status expired', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'expire',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Transaksi ini sudah kadaluarsa')
  })

  it('failed callback payment: transaction status deny', async () => {
    const rollbackTransaction = await Transaction.findByPk(transaction.id)
    rollbackTransaction.status = 'BELUM_BAYAR'
    await rollbackTransaction.save()

    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'deny',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Transaksi ditolak')
  })

  it('failed callback payment: transaction cancelled', async () => {
    const rollbackTransaction = await Transaction.findByPk(transaction.id)
    rollbackTransaction.status = 'BELUM_BAYAR'
    await rollbackTransaction.save()

    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'cancel',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Transaksi dibatalkan')
  })

  it('success callback payment', async () => {
    const rollbackTransaction = await Transaction.findByPk(transaction.id)
    rollbackTransaction.status = 'BELUM_BAYAR'
    await rollbackTransaction.save()

    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil menyelesaikan transaksi, course kini dapat diakses',
    )
  })

  it('failed callback payment: transaction paid', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Transaksi sudah dibayar')
  })

  it('failed callback payment: transaction paid', async () => {
    const cancelTransaction = await Transaction.findByPk(transaction.id)
    cancelTransaction.status = 'DIBATALKAN'
    await cancelTransaction.save()

    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/payment-callback`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Transaksi ini sudah dibatalkan')
  })
})
