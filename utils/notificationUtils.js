const { Notification } = require('../models')
const ApiError = require('./ApiError')

const createNotification = async (type, title, userId, content, next) => {
  try {
    await Notification.create({
      type,
      title,
      content,
      userId,
      isRead: false,
    })
    return true
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

module.exports = {
  createNotification,
}
