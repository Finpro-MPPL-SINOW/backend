const ApiError = require('../utils/ApiError')

const validateUUID = (id) => {
  const uuidV4Regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  if (!uuidV4Regex.test(id)) {
    return false
  }

  return true
}

const checkUUIDParams = () => async (req, res, next) => {
  try {
    const { id, courseId, myModuleId, transactionId } = req.params

    if (id && !validateUUID(id)) {
      return next(new ApiError('ID tidak dengan format UUID', 400))
    }

    if (courseId && !validateUUID(courseId)) {
      return next(new ApiError('Course ID tidak dengan format UUID', 400))
    }

    if (myModuleId && !validateUUID(myModuleId)) {
      return next(new ApiError('My Module ID tidak dengan format UUID', 400))
    }

    if (transactionId && !validateUUID(transactionId)) {
      return next(new ApiError('Transaction ID tidak dengan format UUID', 400))
    }

    return next()
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const checkUUIDBody = () => async (req, res, next) => {
  try {
    const { courseId, categoryId, chapterId, userId } = req.body

    if (courseId && !validateUUID(courseId)) {
      return next(new ApiError('Course ID tidak dengan format UUID', 400))
    }

    if (userId && !validateUUID(userId)) {
      return next(new ApiError('User ID tidak dengan format UUID', 400))
    }

    if (categoryId) {
      if (Array.isArray(categoryId)) {
        categoryId.forEach((id) => {
          if (!validateUUID(id)) {
            return next(
              new ApiError('Category ID tidak dengan format UUID', 400),
            )
          }
        })
      } else {
        if (!validateUUID(categoryId)) {
          return next(new ApiError('Category ID tidak dengan format UUID', 400))
        }
      }
    }

    if (chapterId && !validateUUID(chapterId)) {
      return next(new ApiError('Chapter ID tidak dengan format UUID', 400))
    }
    return next()
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const checkUUIDQuery = () => async (req, res, next) => {
  try {
    const { categoryId, userId } = req.query
    if (categoryId) {
      if (Array.isArray(categoryId)) {
        categoryId.forEach((id) => {
          if (!validateUUID(id)) {
            return next(
              new ApiError('Category ID tidak dengan format UUID', 400),
            )
          }
        })
      } else {
        if (!validateUUID(categoryId)) {
          return next(new ApiError('Category ID tidak dengan format UUID', 400))
        }
      }
    }

    if (userId && !validateUUID(userId)) {
      return next(new ApiError('User ID tidak dengan format UUID', 400))
    }
    return next()
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

module.exports = {
  checkUUIDParams,
  checkUUIDBody,
  checkUUIDQuery,
}
