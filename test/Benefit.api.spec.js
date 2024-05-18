/* eslint-disable */

const request = require('supertest')
const app = require('../index')
require('dotenv').config()

let token = null
let benefitId = null
let courseId = null
let failId = '12345678-ab12-4321-8888-1234567890ab'
let benefitData = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'adella@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const getCourse = await request(app).get('/api/v1/courses')
    courseId = getCourse.body.data[0].id
    benefitData = {
      no: 4,
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
      courseId: courseId,
    }
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

describe('API Create Benefit', () => {
  it('success create benefit', async () => {
    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(benefitData)

    benefitId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil menambahkan data benefit')
  }, 20000)

  it('failed create benefit: missing field', async () => {
    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({})
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Field no, description, courseId harus di isi',
    )
  })

  it('failed create benefit: number isNaN', async () => {
    const failBenefit = {
      no: 'empat',
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
      courseId: courseId,
    }

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor benefit harus berupa angka')
  })

  it('failed create benefit: duplicate number', async () => {
    const failBenefit = {
      no: 1,
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
      courseId: courseId,
    }

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Nomor benefit sudah digunakan dalam course ini',
    )
  })

  it('failed create benefit: Course ID not valid', async () => {
    const failBenefit = {
      no: 4,
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya',
      courseId: 'satu',
    }

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create benefit: course not found', async () => {
    const failBenefit = {
      no: 4,
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya',
      courseId: failId,
    }
    const response = await request(app)
      .post(`/api/v1/benefits`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
    )
  })

  it('failed create benefit: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(benefitData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get All Category Data', () => {
  it('success get category', async () => {
    const response = await request(app).get('/api/v1/benefits')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data benefit')
  })
})

describe('API Get benefit by Id', () => {
  it('success get benefit by id', async () => {
    const response = await request(app).get(`/api/v1/benefits/${benefitId}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mendapatkan data Benefit id: ${benefitId}`,
    )
  })

  it('failed get benefit by id', async () => {
    const response = await request(app).get(`/api/v1/benefits/${failId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Benefit tidak ditemukan')
  })
})

describe('API Update benefit', () => {
  it('success update benefit', async () => {
    const benefitData = {
      description:
        'Fleksibel. cukup menggunakan internet agar bisa belajar, kita bisa mengatur waktu, bebas kapan harus belajar, dan di mana pun anda berada.',
    }
    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(benefitData)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mengupdate data benefit id: ${benefitId}`,
    )
  })

  it('failed update benefit: benefit not found', async () => {
    const failBenefit = {
      no: 'tiga',
      description:
        'Fleksibel. cukup menggunakan internet agar bisa belajar, kita bisa mengatur waktu, bebas kapan harus belajar, dan di mana pun anda berada.',
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${failId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Benefit tidak ditemukan')
  })

  it('failed update benefit: number isNaN', async () => {
    const failBenefit = {
      no: 'tiga',
      description:
        'Fleksibel. cukup menggunakan internet agar bisa belajar, kita bisa mengatur waktu, bebas kapan harus belajar, dan di mana pun anda berada.',
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor benefit harus berupa angka')
  })

  it('failed update benefit: duplicate number', async () => {
    const failBenefit = {
      no: 3,
      description:
        'Fleksibel. cukup menggunakan internet agar bisa belajar, kita bisa mengatur waktu, bebas kapan harus belajar, dan di mana pun anda berada.',
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Nomor benefit sudah digunakan dalam course ini',
    )
  })

  it('failed update benefit: token not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(benefitData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete benefit', () => {
  it('failed delete benefit: benefit not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/${failId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete benefit: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
  it('success delete benefit', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})
