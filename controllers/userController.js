const validator = require('validator')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const {
  User,
  Auth,
  Course,
  MyCourse,
  Module,
  Category,
  Benefit,
  Chapter,
  Notification,
  MyModule,
  Transaction,
} = require('../models')
const ApiError = require('../utils/ApiError')
const { createNotification } = require('../utils/notificationUtils')
const { createToken } = require('../utils/jwtUtils')
const {
  validateCategory,
  validateLevel,
  validateType,
  validateProgress,
} = require('../utils/courseValidator')

const { uploadImage } = require('../utils/imagekitUploader')

const myCourseRelation = (id) => {
  const data = {
    include: [
      {
        model: Course,
        include: [
          {
            model: Chapter,
            as: 'chapters',
            attributes: ['id', 'no', 'name', 'totalDuration'],
            include: [
              {
                model: MyModule,
                as: 'myModules',
                attributes: ['id', 'status'],
                where: {
                  userId: id,
                },
                include: [
                  {
                    model: Module,
                    as: 'moduleData',
                    attributes: ['id', 'no', 'name'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      ['Course', 'id', 'ASC'],
      ['Course', 'chapters', 'no', 'ASC'],
      ['Course', 'chapters', 'myModules', 'moduleData', 'no', 'ASC'],
    ],
  }
  return data
}

const myDetails = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil detail user',
      data: req.user,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateMyDetails = async (req, res, next) => {
  try {
    const { name, country, city } = req.body
    let { phoneNumber } = req.body
    const { user } = req
    const { id } = user

    const updateDataUser = {}

    if (name && name !== '') {
      updateDataUser.name = name
    }

    if (country) {
      updateDataUser.country = country
    }

    if (city) {
      updateDataUser.city = city
    }

    if (req.file) {
      const { imageUrl } = await uploadImage(req.file, next)
      updateDataUser.photoProfileUrl = imageUrl
    }

    const updateDataAuth = {}

    if (phoneNumber) {
      if (`${phoneNumber}`.startsWith('0')) {
        phoneNumber = `+62${phoneNumber.slice(1)}`
      }

      if (!`${phoneNumber}`.startsWith('+')) {
        phoneNumber = `+62${phoneNumber}`
      }
      if (!validator.isMobilePhone(phoneNumber, 'id-ID')) {
        return next(new ApiError('Nomor telepon tidak valid', 400))
      }

      if (phoneNumber !== user.Auth.phoneNumber) {
        const isPhoneNumberExist = await Auth.findOne({
          where: { phoneNumber },
        })
        if (isPhoneNumberExist) {
          return next(
            new ApiError('Nomor telepon sudah terdaftar di akun lain', 400),
          )
        }
        updateDataAuth.phoneNumber = phoneNumber
      }
    }

    if (Object.keys(updateDataUser).length !== 0) {
      await User.update(updateDataUser, {
        where: {
          id,
        },
        returning: true,
      })
    }

    if (updateDataAuth.phoneNumber) {
      await Auth.update(updateDataAuth, {
        where: {
          id: user.Auth.id,
        },
        returning: true,
      })
    }

    const newUser = await User.findByPk(id, {
      include: ['Auth'],
    })

    req.user = newUser

    const token = createToken(
      { id: newUser.id, name: newUser.name, role: newUser.role },
      next,
    )

    await createNotification(
      'Notifikasi',
      'Berhasil memperbarui detail akun',
      newUser.id,
      'Detail akun Anda berhasil diperbarui',
      next,
    )

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data user id: ${newUser.id}`,
      data: {
        token,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const changeMyPassword = async (req, res, next) => {
  try {
    const { user } = req

    const { oldPassword, newPassword } = req.body

    const auth = await Auth.findOne({
      where: {
        userId: user.id,
      },
    })

    if (!oldPassword || !newPassword) {
      return next(
        new ApiError('Password lama dan password baru harus diisi', 400),
      )
    }

    if (newPassword.length < 8) {
      return next(new ApiError('Password min 8 karakter!', 400))
    }

    const isMatch = await bcrypt.compare(oldPassword, auth.password)

    if (!isMatch) {
      return next(new ApiError('Password lama salah', 400))
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await auth.update({
      password: hashedPassword,
    })

    await createNotification(
      'Notifikasi',
      'Password Berhasil Diubah',
      user.id,
      `Halo ${user.name},\n\nPassword akun Anda telah diubah. Jika Anda merasa tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.\n\nTerima kasih,\nTim SINOW 🫡`,
      next,
    )
    return res.status(200).json({
      status: 'Success',
      message: `Password berhasil diubah `,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getMyNotifications = async (req, res, next) => {
  try {
    const myNotifications = await Notification.findAll({
      where: {
        userId: req.user.id,
      },
      order: [['createdAt', 'DESC']],
    })

    if (myNotifications.length === 0 || !myNotifications) {
      return next(new ApiError('Tidak ada notifikasi', 404))
    }

    return res.status(200).json({
      status: 'Success',
      data: myNotifications,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const openNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const notification = await Notification.findByPk(id)
    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }
    if (notification.userId !== userId) {
      return next(new ApiError('Akses ditolak', 403))
    }

    notification.update({
      isRead: true,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil membuka notifikasi',
      data: notification,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const notification = await Notification.findByPk(id)
    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    if (notification.userId !== userId) {
      return next(new ApiError('Akses ditolak', 403))
    }

    notification.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus notifikasi dengan id: ${id}`,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getMyCourses = async (req, res, next) => {
  try {
    const { user } = req

    const { search, categoryId, level, type, progress } = req.query
    const where = {}

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      }
    }

    if (categoryId) {
      validateCategory(categoryId, next)
      if (Array.isArray(categoryId)) {
        where.categoryId = {
          [Op.in]: categoryId,
        }
      } else {
        where.categoryId = categoryId
      }
    }

    if (level) {
      validateLevel(level, next)
      where.level = {
        [Op.in]: Array.isArray(level) ? level : [level],
      }
    }

    if (type) {
      validateType(type, next)
      where.type = type
    }

    if (progress) {
      validateProgress(progress, next)
    }

    const course = await MyCourse.findAll({
      where: {
        userId: user.id,
        isAccessible: true,
        isFollowing: true,
        progress: progress || { [Op.ne]: null },
      },
      include: [
        {
          model: Course,
          where,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
              as: 'category',
            },
          ],
        },
      ],
      order: [['lastSeen', 'DESC']],
    })

    if (!course || course.length === 0) {
      return next(new ApiError('Data course tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil data course',
      data: course,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const openCourse = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId } = req.params

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const myCourse = await MyCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
      include: myCourseRelation(user.id).include,
      order: myCourseRelation(user.id).order,
    })

    if (myCourse) {
      await myCourse.update({
        lastSeen: new Date(),
      })

      return res.status(200).json({
        status: 'Success',
        message: 'Berhasil mendapatkan detail course user',
        data: {
          myCourse: {
            id: myCourse.id,
            isAccessible: myCourse.isAccessible,
            isFollowing: myCourse.isFollowing,
            progress: myCourse.progress,
            progressPercentage: myCourse.progressPercentage,
            lastSeen: myCourse.lastSeen,
          },
          chapters: myCourse.Course.chapters,
        },
      })
    }

    const createMyCourse = await MyCourse.create({
      userId: user.id,
      courseId,
      isAccessible: course.type === 'gratis',
      isFollowing: false,
      progress: 'inProgress',
      progressPercentage: 0,
      lastSeen: new Date(),
    })

    const myCourseBuffer = await MyCourse.findByPk(createMyCourse.id, {
      include: [
        {
          model: Course,
          include: [
            {
              model: Chapter,
              as: 'chapters',
              attributes: ['id', 'no', 'name'],
              include: [
                {
                  model: Module,
                  as: 'modules',
                  attributes: ['id', 'no', 'name', 'videoUrl', 'duration'],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ['Course', 'chapters', 'no', 'ASC'],
        ['Course', 'chapters', 'modules', 'no', 'ASC'],
      ],
    })

    if (myCourseBuffer.Course.chapters.length > 0) {
      await Promise.all(
        myCourseBuffer.Course.chapters.map(async (chapter, chapterIndex) => {
          if (chapter.modules.length > 0) {
            await Promise.all(
              // eslint-disable-next-line
              chapter.modules.map(async (module, moduleIndex) => {
                try {
                  await MyModule.create({
                    userId: user.id,
                    moduleId: module.id,
                    chapterId: chapter.id,
                    status:
                      (module.no === 1 &&
                        (chapter.no === 1 || chapterIndex === 0)) ||
                      (moduleIndex === 0 && chapterIndex === 0)
                        ? 'terbuka'
                        : 'terkunci',
                  })
                } catch (error) {
                  return next(new ApiError(error.message, 500))
                }
              }),
            )
          }
        }),
      )
    }

    const newMyCourse = await MyCourse.findByPk(createMyCourse.id, {
      include: myCourseRelation(user.id).include,
      order: myCourseRelation(user.id).order,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil mengikuti course',
      data: {
        myCourse: {
          id: newMyCourse.id,
          isAccessible: newMyCourse.isAccessible,
          isFollowing: newMyCourse.isFollowing,
          progress: newMyCourse.progress,
          progressPercentage: newMyCourse.progressPercentage,
          lastSeen: newMyCourse.lastSeen,
        },
        chapters: newMyCourse.Course.chapters,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const followCourse = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId } = req.params

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const myCourse = await MyCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (!myCourse) {
      return next(new ApiError('My Course tidak ditemukan', 404))
    }

    if (!myCourse.isAccessible) {
      return next(
        new ApiError(
          'Course ini adalah course premium, silahkan beli course premium terlebih dahulu',
          403,
        ),
      )
    }

    if (myCourse.isFollowing) {
      return next(new ApiError('Anda sudah mengikuti course ini', 400))
    }

    myCourse.update({
      isFollowing: true,
    })

    course.update({
      totalUser: course.totalUser + 1,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengikuti course',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const unfollowCourse = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId } = req.params

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const myCourse = await MyCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (!myCourse) {
      return next(new ApiError('My Course tidak ditemukan', 404))
    }

    myCourse.update({
      isFollowing: false,
    })

    course.update({
      totalUser: course.totalUser - 1,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil berhenti mengikuti course',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const openMyModule = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId, myModuleId } = req.params

    const myCourse = await MyCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
      include: myCourseRelation(user.id).include,
      order: [['Course', 'chapters', 'myModules', 'moduleData', 'no', 'ASC']],
    })

    if (!myCourse) {
      return next(new ApiError('My Course tidak ditemukan', 404))
    }

    const mergedMyModules = myCourse.Course.chapters.flatMap(
      (chapter) => chapter.myModules,
    )

    const myModule = await MyModule.findByPk(myModuleId, {
      include: [
        {
          model: Module,
          as: 'moduleData',
          attributes: ['no', 'name', 'videoUrl'],
        },
      ],
    })

    if (!myModule) {
      return next(new ApiError('My Module tidak ditemukan', 404))
    }

    const indexMyModule = mergedMyModules.findIndex(
      (module) => module.id === myModuleId,
      10,
    )

    if (indexMyModule === -1) {
      return next(
        new ApiError('Tidak ada relasi antara my course dan my module', 403),
      )
    }

    const totalModuleStudied = mergedMyModules.reduce(
      (count, module) => (module.status === 'dipelajari' ? count + 1 : count),
      0,
    )

    if (myModule.status === 'terkunci') {
      if (!myCourse.isAccessible) {
        return next(
          new ApiError(
            'Anda perlu menyelesaikan pembayaran terlebih dahulu untuk mengakses course ini',
            403,
          ),
        )
      }
      if (!myCourse.isFollowing) {
        return next(new ApiError('Anda belum mengikuti course ini', 403))
      }
      return next(
        new ApiError(
          'Module ini masih terkunci, selesaikan module yang sebelumnya dulu',
          403,
        ),
      )
    }

    if (
      myModule.status === 'terbuka' &&
      myCourse.isAccessible === true &&
      myCourse.isFollowing === true
    ) {
      const nextMyModule = mergedMyModules[indexMyModule + 1]
      if (nextMyModule) {
        await nextMyModule.update({
          status: 'terbuka',
        })
      }

      const progressPercentage = Math.ceil(
        ((totalModuleStudied + 1) / mergedMyModules.length) * 100,
      )

      if (progressPercentage === 100) {
        await myCourse.update({
          progress: 'completed',
        })
      }

      await myCourse.update({
        progressPercentage,
      })

      await myModule.update({
        status: 'dipelajari',
      })

      await myModule.reload()
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil membuka module',
      data: {
        module: myModule.moduleData,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllMyTransaction = async (req, res, next) => {
  try {
    const { user } = req

    const transactions = await Transaction.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    if (transactions.length === 0) {
      return next(new ApiError('Tidak ada transaksi', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil transaksi',
      data: {
        transactions,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getMyTransactionById = async (req, res, next) => {
  try {
    const { user } = req
    const { transactionId } = req.params

    const transaction = await Transaction.findByPk(transactionId)
    const course = await Course.findByPk(transaction.courseId)

    if (!transaction) {
      return next(new ApiError('Transaksi tidak ditemukan', 404))
    }

    if (transaction.userId !== user.id) {
      return next(
        new ApiError(
          'User tidak memiliki akses untuk melihat transaksi ini',
          403,
        ),
      )
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data transaksi',
      data: {
        transaction,
        course,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const deleteTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params
    const { user } = req
    const transaction = await Transaction.findByPk(transactionId)
    if (!transaction) {
      return next(new ApiError('Data transaksi tidak ditemukan', 404))
    }

    if (transaction.userId !== user.id) {
      return next(
        new ApiError(
          'User tidak memiliki akses untuk menghapus transaksi ini',
          403,
        ),
      )
    }

    if (transaction.status === 'SUDAH_BAYAR') {
      return next(
        new ApiError(
          'Tidak dapat menghapus data transaksi yang sudah dibayar',
          403,
        ),
      )
    }

    await transaction.destroy()
    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil menghapus transaksi',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  myDetails,
  updateMyDetails,
  getMyNotifications,
  openNotification,
  deleteNotification,
  changeMyPassword,
  getMyCourses,
  openCourse,
  followCourse,
  openMyModule,
  getAllMyTransaction,
  getMyTransactionById,
  deleteTransaction,
  unfollowCourse,
}
