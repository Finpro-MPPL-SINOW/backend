const imagekit = require('../lib/imagekit')
const ApiError = require('./ApiError')

const isVideoFile = (file) => file.mimetype.startsWith('video/')

const isImageFile = (file) => file.mimetype.startsWith('image/')

const getExtension = (file) => {
  const split = file.originalname.split('.')
  return split[split.length - 1]
}

const uploadVideo = async (file, next) => {
  try {
    if (!isVideoFile(file)) {
      return next(new ApiError('Harus mengisi file video di kolom video', 400))
    }
    const extension = getExtension(file)

    const uploadedVideo = await imagekit.upload({
      file: file.buffer,
      fileName: `Video-${Date.now()}.${extension}`,
    })

    if (!uploadedVideo) {
      return next(new ApiError('Gagal upload video', 400))
    }

    return {
      videoUrl: uploadedVideo.url,
      videoDuration: uploadedVideo.duration,
    }
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const uploadImage = async (file, next) => {
  try {
    if (!isImageFile(file)) {
      return next(new ApiError('Harus mengisi file image di kolom image', 400))
    }
    const extension = getExtension(file)

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: `Image-${Date.now()}.${extension}`,
    })

    if (!uploadedImage) {
      return next(new ApiError('Gagal upload image', 400))
    }

    return {
      imageUrl: uploadedImage.url,
    }
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  uploadVideo,
  uploadImage,
}
