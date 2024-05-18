const jwt = require('jsonwebtoken')
const { User, Auth } = require('../models')
const ApiError = require('../utils/ApiError')

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization

    if (!bearerToken) {
      return next(new ApiError('Tidak ada token', 401))
    }

    const token = bearerToken.split(' ')[1]

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return next(new ApiError('Token tidak valid', 401))
    }

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Auth,
          attributes: ['id', 'email', 'phoneNumber', 'userId'],
        },
      ],
    })

    if (!user) {
      return next(new ApiError('Token tidak valid', 401))
    }

    req.user = user

    return next()
  } catch (error) {
    return next(new ApiError(error.message, 401))
  }
}
