const router = require('express').Router()

const Course = require('../controllers/courseController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const uploader = require('../middlewares/uploader')
const { checkUUIDParams, checkUUIDBody } = require('../middlewares/checkUUID')

router.get('/', Course.getAllCourse)
router.get('/others/:courseId', checkUUIDParams(), Course.getOtherCourse)
router.get('/:id', checkUUIDParams(), Course.getCourseById)
router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Course.deleteCourse,
)
router.post(
  '/',
  authenticate,
  checkRole('admin'),
  uploader.fields([{ name: 'image' }, { name: 'video' }]),
  checkUUIDBody(),
  Course.createCourse,
)
router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  uploader.fields([{ name: 'image' }, { name: 'video' }]),
  checkUUIDBody(),
  Course.updateCourse,
)

module.exports = router
