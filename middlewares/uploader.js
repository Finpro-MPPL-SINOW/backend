const multer = require('multer')
const ApiError = require('../utils/ApiError')

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video/')
    || file.mimetype.startsWith('image/')
  ) {
    return cb(null, true)
  }

  return cb(new ApiError('File harus berupa video atau foto', 400), false)
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
})

module.exports = upload
