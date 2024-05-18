const { Op } = require('sequelize')
const { Notification, User } = require('../models')
const ApiError = require('../utils/ApiError')

const createNotificationForAllUsers = async (req, res, next) => {
  try {
    const { type, title, content } = req.body

    if (!type || !title || !content) {
      return next(new ApiError('type, title, content tidak boleh kosong!', 400))
    }
    const users = await User.findAll({
      where: {
        role: 'user',
      },
    })

    const notificationsData = users.map((user) => ({
      type,
      title,
      content,
      userId: user.id,
      isRead: false,
    }))

    await Notification.bulkCreate(notificationsData)

    return res.status(201).json({
      status: 'Success',
      message: 'Notifications berhasil dibuat',
      data: {
        type,
        title,
        content,
      },
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const getAllNotifications = async (req, res, next) => {
  try {
    const { limit = 100, type, title, userId } = req.query

    if (Number.isNaN(Number(limit)) || limit <= 0) {
      return next(new ApiError('Batas jumlah notifikasi tidak valid', 400))
    }
    if (limit > 500) {
      return next(new ApiError('Batas notifikasi maksimal adalah 500', 400))
    }

    if (userId && (Number.isNaN(Number(userId)) || userId <= 0)) {
      return next(new ApiError('ID pengguna tidak valid', 400))
    }

    const where = {}

    if (type) {
      where.type = {
        [Op.iLike]: `%${type}%`,
      }
    }

    if (title) {
      where.title = {
        [Op.iLike]: `%${title}%`,
      }
    }

    if (userId) {
      where.userId = userId
    }

    const notifications = await Notification.findAll({
      where,
      limit,
      order: [['createdAt', 'DESC']],
    })

    if (!notifications || notifications.length === 0) {
      return next(new ApiError('Tidak ada notifikasi', 404))
    }

    return res.status(200).json({
      status: 'Success',
      data: notifications,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    const { type, title, content } = req.body

    const notification = await Notification.findByPk(id)
    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    const updateData = {}

    if (type) {
      updateData.type = type
    }

    if (title) {
      updateData.title = title
    }

    if (content) {
      updateData.content = content
    }

    await notification.update(updateData, {
      where: {
        id,
      },
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Notifikasi diperbarui',
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const updateNotificationByTitle = async (req, res, next) => {
  try {
    const { title: titleParam } = req.params
    const { type, content, title } = req.body

    const notification = await Notification.findOne({
      where: {
        title: titleParam,
      },
    })

    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    const updateData = {}

    if (type) {
      updateData.type = type
    }

    if (content) {
      updateData.content = content
    }

    if (title) {
      updateData.title = title
    }

    await Notification.update(updateData, {
      where: {
        title: titleParam,
      },
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Notifikasi berhasil diperbarui',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const deleteNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params

    const deletedNotification = await Notification.destroy({
      where: {
        id,
      },
    })

    if (!deletedNotification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus notifikasi dengan id: ${id}`,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}
const deleteNotificationByTitle = async (req, res, next) => {
  try {
    const { title } = req.params

    const deletedNotification = await Notification.destroy({
      where: {
        title,
      },
    })

    if (!deletedNotification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus notifikasi dengan id: ${title}`,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

module.exports = {
  createNotificationForAllUsers,
  getAllNotifications,
  updateNotification,
  deleteNotificationById,
  deleteNotificationByTitle,
  updateNotificationByTitle,
}
