const router = require('express').Router()
const uploader = require('../middlewares/uploader')
const Category = require('../controllers/categoryController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const { checkUUIDParams, checkUUIDBody } = require('../middlewares/checkUUID')

router.get('/', Category.getAllCategory)
router.get('/:id', checkUUIDParams(), Category.getCategoryById)
router.post(
  '/',
  authenticate,
  checkRole('admin'),
  uploader.single('image'),
  checkUUIDBody(),
  Category.createCategory,
)

router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  uploader.single('image'),
  checkUUIDBody(),
  Category.updateCategory,
)

router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Category.deleteCategory,
)

module.exports = router
