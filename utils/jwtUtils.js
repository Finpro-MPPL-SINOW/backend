const jwt = require('jsonwebtoken')
const ApiError = require('./ApiError')

const createToken = (payload, next) => {
  if (!payload.id || !payload.name || !payload.role) {
    return next(new ApiError('Payload tidak valid', 400))
  }
  try {
    const token = jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        role: payload.role,
      },
      process.env.JWT_SECRET,
      {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_LOGIN_TOKEN_EXPIRES_IN,
      },
    )

    return token
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createToken,
}
