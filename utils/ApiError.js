class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error'
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError
