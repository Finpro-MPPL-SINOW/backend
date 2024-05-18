const router = require('express').Router()

const dashboardDetail = require('../controllers/dashboardDetailController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')

router.get(
  '/totalCourse',
  authenticate,
  checkRole('admin'),
  dashboardDetail.getTotalCourse,
)
router.get(
  '/totalPremiumCourse',
  authenticate,
  checkRole('admin'),
  dashboardDetail.getTotalPremiumCourse,
)
router.get(
  '/totalActiveUser',
  authenticate,
  checkRole('admin'),
  dashboardDetail.getTotalActiveUser,
)

module.exports = router
