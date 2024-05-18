/* eslint-disable */
const request = require('supertest')
const app = require('../index')
const { Auth, OTP } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('API Register', () => {
  it('success register', async () => {
    const user = {
      email: 'test@gmail.com',
      password: '12345678',
      name: 'fadhlan',
      phoneNumber: '01234567',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Registrasi berhasil & OTP berhasil dikirim ke email anda, silahkan verifikasi OTP sebelum login',
    )
  })

  it('failed register: missing field', async () => {
    const user = {}
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kolom nama,email, nomor telepon,dan password harus diisi',
    )
  })

  it('failed register: not valid email', async () => {
    const user = {
      email: 'fail',
      password: '12345678',
      name: 'fadhlan',
      phoneNumber: '01234567',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak valid')
  })

  it('failed register: email already registered', async () => {
    const user = {
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
      name: 'fadhlan',
      phoneNumber: '01234567',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email sudah terdaftar')
  })

  it('failed register: not valid phone number', async () => {
    const user = {
      email: 'fail@gmail.com',
      password: '12345678',
      name: 'fadhlan',
      phoneNumber: '01asdaa',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor telepon tidak valid')
  })

  it('failed register: phone number already registered', async () => {
    const user = {
      email: 'fail@gmail.com',
      password: '12345678',
      name: 'fadhlan',
      phoneNumber: '081234567100',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor telepon sudah terdaftar')
  })

  it('failed register: password less than 8 character', async () => {
    const user = {
      email: 'fail@gmail.com',
      password: '12',
      name: 'fadhlan',
      phoneNumber: '08998653078',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Password min 8 karakter')
  })

  it('failed register: password more than 12 character', async () => {
    const user = {
      email: 'fail@gmail.com',
      password: '122345678908211',
      name: 'fadhlan',
      phoneNumber: '08998653078',
    }
    const response = await request(app).post('/api/v1/auth/register').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Password max 12 karakter')
  })
})

describe('API Login', () => {
  it('success login', async () => {
    const user = {
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    }
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil login')
  })

  it('failed login: missing field', async () => {
    const user = {}
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email dan password harus diisi')
  })

  it('failed login: not valid email', async () => {
    const user = {
      email: 'fail',
      password: '12345678',
    }
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak valid')
  })

  it('failed login: wrong email', async () => {
    const user = {
      email: 'fail@admin.sinow.com',
      password: '12345678',
    }
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak terdaftar')
  })

  it('failed login: email not verified', async () => {
    const user = {
      email: 'test@gmail.com',
      password: '12345678',
    }
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email belum diverifikasi')
  })

  it('failed login: wrong password', async () => {
    const user = {
      email: 'fadhlan@admin.sinow.com',
      password: '123456789',
    }
    const response = await request(app).post('/api/v1/auth/login').send(user)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Password salah')
  })
})

describe('API Resend OTP', () => {
  it('success resend otp', async () => {
    const response = await request(app)
      .post('/api/v1/auth/resend-otp')
      .send({ email: 'test@gmail.com' })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Kode OTP berhasil dikirim ulang ke email',
    )
  })

  it('failed resend otp: missing field', async () => {
    const response = await request(app).post('/api/v1/auth/resend-otp')
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email harus diisi')
  })

  it('failed resend otp: not valid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/resend-otp')
      .send({ email: 'test' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak valid')
  })

  it('failed resend otp: email not registered', async () => {
    const response = await request(app)
      .post('/api/v1/auth/resend-otp')
      .send({ email: 'test123@gmail.com' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak terdaftar')
  })

  it('failed resend otp: email already verified', async () => {
    const response = await request(app)
      .post('/api/v1/auth/resend-otp')
      .send({ email: 'fadhlan@admin.sinow.com' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Email sudah diverifikasi, tidak memerlukan autentikasi OTP',
    )
  })
})

describe('API Verify Email', () => {
  it('failed verify email: wrong otp', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'test@gmail.com', otpCode: '123456' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('OTP tidak valid')
  })

  it('success verify email', async () => {
    const otpCode = await OTP.findOne({
      where: {
        userEmail: 'test@gmail.com',
      },
    })

    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'test@gmail.com', otpCode: otpCode.otpValue })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil verifikasi email')
  })

  it('failed verify email: missing field', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'test@gmail.com' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email dan kode OTP harus diisi')
  })

  it('failed verify email: not valid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'fail', otpCode: '123456' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak valid')
  })

  it('failed verify email: wrong email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'test123123@gmail.com', otpCode: '123456' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak terdaftar')
  })

  it('failed verify email: email already verified', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'fadhlan@admin.sinow.com', otpCode: '123456' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email sudah diverifikasi')
  })

  it('failed verify email: not valid otp', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: 'test@gmail.com', otpCode: '1234563123' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kode OTP harus terdiri dari 6 digit numerik',
    )
  })
})

describe('API Request Reset Password', () => {
  it('success request reset password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: 'test@gmail.com' })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Tautan reset password berhasil dikirim ke email',
    )
  })

  it('failed request reset password: missing field', async () => {
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({})
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email harus diisi')
  })

  it('failed request reset password: not valid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: 'fail' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak valid')
  })

  it('failed request reset password: email not registered', async () => {
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: 'test123@gmail.com' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Email tidak terdaftar')
  })
})

describe('API Reset Password', () => {
  it('success reset password', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ password: '1234567890', confirmPassword: '1234567890' })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Password berhasil diubah')
  })

  it('failed reset password: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/auth/reset-password/token')
      .send({ password: '1234567890', confirmPassword: '1234567890' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Token tidak valid')
  })

  it('failed reset password: no password', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ confirmPassword: '1234567890' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Password harus diisi')
  })

  it('failed reset password: no confirm password', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ password: '1234567890' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Konfirmasi password harus diisi')
  })

  it('failed reset password: password not match', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ password: '1234567890', confirmPassword: '123456789' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Password tidak cocok')
  })

  it('failed reset password: password less than 8', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ password: '123', confirmPassword: '123' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Panjang password minimal 8 karakter')
  })

  it('failed reset password: password more than 8', async () => {
    const auth = await Auth.findOne({ where: { email: 'test@gmail.com' } })

    const token = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )
    const response = await request(app)
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ password: '123456789098765', confirmPassword: '123456789098765' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Panjang password maksimal 12 karakter')
  })
})
