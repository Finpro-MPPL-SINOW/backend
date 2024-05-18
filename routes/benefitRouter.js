const router = require('express').Router()

const Benefit = require('../controllers/benefitController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.post('/', authenticate, checkRole('admin'), Benefit.createBenefit)
router.get('/', Benefit.getAllBenefit)
router.get('/:id', checkUUIDParams(), Benefit.getBenefitById)
router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Benefit.updateBenefit,
)
router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Benefit.deleteBenefit,
)

module.exports = router
