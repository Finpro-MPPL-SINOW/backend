const { Course, User, Auth } = require('../models')
const ApiError = require('../utils/ApiError')

const getTotalCourse = async (req, res, next) => {
  try {
    const totalCourses = await Course.count()

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan jumlah total course terdaftar',
      data: { totalCourses },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getTotalPremiumCourse = async (req, res, next) => {
  try {
    const totalPremiumCourses = await Course.count({
      where: {
        type: 'premium',
      },
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan jumlah total course premium',
      data: { totalPremiumCourses },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const getTotalActiveUser = async (req, res, next) => {
  try {
    const totalActiveUsers = await User.count({
      where: {
        role: 'user',
      },
      include: [
        {
          model: Auth,
          where: {
            isEmailVerified: true,
          },
        },
      ],
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan jumlah total pengguna aktif',
      data: { totalActiveUsers },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  getTotalCourse,
  getTotalPremiumCourse,
  getTotalActiveUser,
}
