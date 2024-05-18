const router = require('express').Router()

const Module = require('../controllers/moduleController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const uploader = require('../middlewares/uploader')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  uploader.single('video'),
  checkUUIDParams(),
  Module.createModule,
)
router.get('/', Module.getAllModule)
router.get('/:id', checkUUIDParams(), Module.getModuleById)
router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  uploader.single('video'),
  checkUUIDParams(),
  Module.updateModule,
)
router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Module.deleteModule,
)

module.exports = router
