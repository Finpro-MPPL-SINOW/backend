const router = require('express').Router()

const User = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')
const uploader = require('../middlewares/uploader')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.get('/', authenticate, User.myDetails)
router.patch(
  '/update',
  authenticate,
  uploader.single('image'),
  checkUUIDParams(),
  User.updateMyDetails,
)

router.patch('/change-password', authenticate, User.changeMyPassword)

router.get('/notifications', authenticate, User.getMyNotifications)

router.get(
  '/notifications/:id',
  checkUUIDParams(),
  authenticate,
  User.openNotification,
)

router.delete(
  '/notifications/:id',
  checkUUIDParams(),
  authenticate,
  User.deleteNotification,
)

router.get('/my-courses', authenticate, User.getMyCourses)

router.get(
  '/my-courses/:courseId',
  checkUUIDParams(),
  authenticate,
  User.openCourse,
)

router.post(
  '/my-courses/:courseId/follow',
  checkUUIDParams(),
  authenticate,
  User.followCourse,
)

router.post(
  '/my-courses/:courseId/unfollow',
  checkUUIDParams(),
  authenticate,
  User.unfollowCourse,
)

router.get(
  '/my-courses/:courseId/modules/:myModuleId',
  checkUUIDParams(),
  authenticate,
  User.openMyModule,
)

router.get('/transaction', authenticate, User.getAllMyTransaction)
router.get(
  '/transaction/:transactionId',
  checkUUIDParams(),
  authenticate,
  User.getMyTransactionById,
)
router.delete(
  '/transaction/:transactionId',
  checkUUIDParams(),
  authenticate,
  User.deleteTransaction,
)

module.exports = router
