/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const path = require('path')
require('dotenv').config()

let token = null
let courseId = null
let categoryId = null
const fakeId = '12345678-ab12-4321-8888-1234567890ab'

let courseData = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const getCategory = await request(app).get('/api/v1/category')
    categoryId = getCategory.body.data[0].id

    courseData = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'gratis',
      price: 0,
      promoDiscountPercentage: 0,
      courseBy: 'John Doe',
    }
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

const imagePath = path.join(__dirname, '../public/images/image.png')

const videoPath = path.join(__dirname, '../public/videos/video.mp4')

describe('API Create Course', () => {
  it('success create course', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
      .attach('image', imagePath)
      .attach('video', videoPath)
    console.log('\n\n\n\n\n', response.body)
    courseId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  }, 20000)

  it('failed create course: image not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
      .attach('image', videoPath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: video not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
      .attach('image', imagePath)
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: price = 0 on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 0,
      promoDiscountPercentage: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: price isNaN on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 'not a number',
      promoDiscountPercentage: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: promo discount percentage is not beetween 0 and 100', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 10000,
      promoDiscountPercentage: 10000,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: level tidak valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'level tidak valid',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 10000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: rating is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 100,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: rating isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 'isNaN',
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: category not found', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: fakeId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: type not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'akwoakwao',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: course data not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
  it('failed create course: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(courseData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get All Course Data', () => {
  it('success get course', async () => {
    const response = await request(app).get('/api/v1/courses')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get course: no course data', async () => {
    const response = await request(app).get('/api/v1/courses?search=sdfasdfas')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get course: category id not valid', async () => {
    const response = await request(app).get(`/api/v1/courses?categoryId=12321`)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get course: category id not found', async () => {
    const response = await request(app).get(
      `/api/v1/courses?categoryId=${fakeId}`,
    )
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get course: level not valid', async () => {
    const response = await request(app).get('/api/v1/courses?level=asd')
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get course: type not valid', async () => {
    const response = await request(app).get('/api/v1/courses?type=asd')
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get Course by Id', () => {
  it('success get course by id', async () => {
    const response = await request(app).get(`/api/v1/courses/${courseId}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get course by id', async () => {
    const response = await request(app).get(`/api/v1/courses/${fakeId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Update Course', () => {
  it('success update course', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
  it('failed update course: course not found', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: image not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
      .attach('image', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: price = 0 on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 0,
      promoDiscountPercentage: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: price isNaN on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 'not a number',
      promoDiscountPercentage: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: promo discount percentage is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10000,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: level is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'level tidak valid',
      rating: 4,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: rating is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 100,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: rating isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 'isNaN',
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: category not found', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: fakeId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: type not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: categoryId,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'akwoakwao',
      price: 20000,
      promoDiscountPercentage: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: video not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(courseData)
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
  it('failed update course: token not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(courseData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete Course', () => {
  it('success delete course', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete course: course not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${fakeId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete course: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
