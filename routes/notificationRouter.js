const router = require('express').Router()
const Notification = require('../controllers/notificationController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  Notification.createNotificationForAllUsers,
)

router.get(
  '/',
  authenticate,
  checkRole('admin'),
  Notification.getAllNotifications,
)

router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Notification.updateNotification,
)

router.put(
  '/title/:title',
  authenticate,
  checkRole('admin'),
  Notification.updateNotificationByTitle,
)

router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Notification.deleteNotificationById,
)
router.delete(
  '/title/:title',
  authenticate,
  checkRole('admin'),
  Notification.deleteNotificationByTitle,
)

module.exports = router
