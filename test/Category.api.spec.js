/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const path = require('path')
require('dotenv').config()

let token = null
let categoryId = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'

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

const categoryData = {
  name: 'Phyton Programming',
}

const imagePath = path.join(__dirname, '../public/images/image.png')

const videoPath = path.join(__dirname, '../public/videos/video.mp4')

describe('API Create Category', () => {
  it('success create category', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(categoryData)
      .attach('image', imagePath)

    categoryId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil menambahkan data category')
  }, 20000)

  it('failed create category: data not valid', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .attach('image', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Name harus diisi')
  })

  it('failed create category: invalid image format', async () => {
    const categoryData = {
      name: 'Business Manajement',
    }
    const response = await request(app)
      .post('/api/v1/category')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(categoryData)
      .attach('image', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Harus mengisi file image di kolom image',
    )
  })

  it('failed create category: duplikat name', async () => {
    const failCategory = {
      name: 'Web Development',
    }

    const response = await request(app)
      .post('/api/v1/category')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCategory)
      .attach('image', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nama category sudah ada')
  })

  it('failed create category: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(categoryData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Token tidak valid')
  })
})

describe('API Get All category Data', () => {
  it('success get all category', async () => {
    const response = await request(app).get('/api/v1/category')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data category')
  })
  it('success get search category by name', async () => {
    const response = await request(app).get('/api/v1/category?name=development')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data category')
  })
  it('failed get category: no category data', async () => {
    const response = await request(app).get('/api/v1/category?name=sdfasdfas')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Category tidak ditemukan')
  })
})

describe('API Get Category by Id', () => {
  it('success get category by id', async () => {
    const response = await request(app).get(`/api/v1/category/${categoryId}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mendapatkan data category id: ${categoryId}`,
    )
  })

  it('failed get category by id', async () => {
    const response = await request(app).get(`/api/v1/category/${fakeId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Category tidak ditemukan')
  })
})

describe('API Update Category', () => {
  it('success update category', async () => {
    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(categoryData)
      .attach('image', imagePath)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      `Berhasil mengupdate data category id: ${categoryId}`,
    )
  })

  it('failed update category: invalid image format', async () => {
    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .attach('image', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Harus mengisi file image di kolom image',
    )
  })

  it('failed update category: token not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(categoryData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Token tidak valid')
  })
})

describe('API Delete category', () => {
  it('success delete category', async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete category: category not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete category: there is course with this category', async () => {
    const categoryData = await request(app).get('/api/v1/category')
    const categoryId = categoryData.body.data[0].id
    const response = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Gagal menghapus kategory karena sudah ada course dengan kategory ini',
    )
  })
  it('failed delete category: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Token tidak valid')
  })
})
