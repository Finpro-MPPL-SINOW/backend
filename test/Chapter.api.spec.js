/* eslint-disable */

const request = require('supertest')
const app = require('../index')
require('dotenv').config()

let token = null
let chapterId = null
let courseId = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'
let chapterData = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'adella@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const getCourse = await request(app).get('/api/v1/courses')
    courseId = getCourse.body.data[0].id

    chapterData = {
      no: 3,
      name: 'Memulai Desain Web',
      courseId: courseId,
    }
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

describe('API Create Chapter', () => {
  it('success create chapter', async () => {
    const response = await request(app)
      .post('/api/v1/chapters')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(chapterData)

    console.log('\n\n\n\n\n', response.body)
    chapterId = response.body.data.id

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil menambahkan data chapter')
  }, 20000)

  it('failed create chapter: missing field', async () => {
    const failChapter = {}

    const response = await request(app)
      .post('/api/v1/chapters')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failChapter)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Field no, name, courseId harus di isi')
  })
  it('failed create chapter: duplicate name', async () => {
    const failChapter = {
      no: 5,
      name: 'Memulai Desain Web',
      courseId: courseId,
    }

    const response = await request(app)
      .post('/api/v1/chapters')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failChapter)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Nama chapter sudah ada dalam course ini',
    )
  })

  it('failed create chapter: number isNaN', async () => {
    const failChapter = {
      no: 'tiga',
      name: 'Memulai Desain Web',
      courseId: courseId,
    }

    const response = await request(app)
      .post('/api/v1/chapters')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failChapter)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor chapter harus berupa angka')
  })

  it('failed create chapter: course not found', async () => {
    const failChapter = {
      no: 3,
      name: 'Memulai Desain Web',
      courseId: fakeId,
    }

    const response = await request(app)
      .post(`/api/v1/chapters`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failChapter)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
    )
  })

  it('failed create chapter: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/chapters')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(chapterData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get All Chapter Data', () => {
  it('success get chapter', async () => {
    const response = await request(app).get('/api/v1/chapters')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data chapter')
  })
})

describe('API Get Chapter by Id', () => {
  it('success get chapter by id', async () => {
    const response = await request(app).get(`/api/v1/chapters/${chapterId}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mendapatkan data Chapter id: ${chapterId}`,
    )
  })

  it('failed get chapter by id', async () => {
    const response = await request(app).get(`/api/v1/chapters/${fakeId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Chapter tidak ditemukan')
  })
})

describe('API Update chapter', () => {
  it('success update chapter', async () => {
    const chapterData = {
      no: 4,
      name: 'Memulai Desain Figma',
    }
    const response = await request(app)
      .put(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(chapterData)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mengupdate data chapter id: ${chapterId}`,
    )
  })

  it('failed update chapter: duplikat number', async () => {
    const failChapter = {
      no: 1,
      name: 'Memulai Desain Figma',
    }

    const response = await request(app)
      .put(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failChapter)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Nomor chapter sudah digunakan dalam course ini',
    )
  })

  it('failed update chapter: number isNaN', async () => {
    const failchapter = {
      no: 'empat',
      name: 'Memulai Desain Web',
    }

    const response = await request(app)
      .put(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failchapter)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor chapter harus berupa angka')
  })

  it('failed update chapter: token not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(chapterData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete chapter', () => {
  it('success delete chapter', async () => {
    const response = await request(app)
      .delete(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete chapter: chapter not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/chapters/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete chapter: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/chapters/${chapterId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
