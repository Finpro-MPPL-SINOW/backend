const { Op } = require('sequelize')
const { Module, Chapter, User, MyCourse } = require('../models')
const ApiError = require('../utils/ApiError')

const { uploadVideo } = require('../utils/imagekitUploader')

const createModule = async (req, res, next) => {
  try {
    let { no } = req.body
    const { name, chapterId, videoURL, videoDuration } = req.body

    const missingFields = ['name', 'no', 'chapterId'].filter(
      (field) => !req.body[field],
    )
    if (missingFields.length > 0) {
      return next(
        new ApiError(`Field ${missingFields.join(', ')} harus di isi`, 400),
      )
    }

    if (Number.isNaN(Number(no))) {
      return next(new ApiError('Nomor module harus berupa angka', 400))
    }
    no = parseInt(no, 10)

    if (!videoURL && !req.file) {
      return next(new ApiError('Harus menyertakan video', 400))
    }

    const checkChapter = await Chapter.findByPk(chapterId)
    if (!checkChapter) {
      return next(
        new ApiError(
          'Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia',
          404,
        ),
      )
    }

    const checkMyCourse = await MyCourse.findOne({
      where: {
        courseId: checkChapter.courseId,
        isFollowing: true,
      },
    })

    if (checkMyCourse) {
      return next(
        new ApiError(
          'Modul tidak dapat ditambahkan karena sudah ada user yang mengikuti course ini',
          400,
        ),
      )
    }

    const existingModule = await Module.findOne({
      where: {
        [Op.and]: [
          { chapterId },
          {
            [Op.or]: [{ name }, { no }],
          },
        ],
      },
    })

    if (existingModule) {
      const errorMessage = []

      if (existingModule.name === name) {
        errorMessage.push('Nomor modul sudah digunakan dalam chapter ini')
      }

      if (existingModule.no === no) {
        errorMessage.push('Nomor modul sudah digunakan dalam chapter ini')
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(', '), 400))
      }
    }

    if (videoURL) {
      if (!videoDuration) {
        return next(new ApiError('Harus menyertakan durasi video', 400))
      }
    }

    let uploadData
    if (!videoURL) {
      uploadData = await uploadVideo(req.file, next)
    }

    const module = await Module.create({
      name,
      no,
      videoUrl: uploadData ? uploadData.videoUrl : videoURL,
      chapterId,
      duration: uploadData ? uploadData.videoDuration : videoDuration,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil menambahkan data module',
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllModule = async (req, res, next) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Chapter,
          attributes: ['no', 'name'],
          as: 'chapter',
        },
      ],
      order: [['id', 'ASC']],
    })

    if (!modules || modules.length === 0) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data modules',
      data: modules,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params
    const module = await Module.findByPk(id, {
      include: [
        {
          model: Chapter,
          attributes: ['no', 'name'],
          as: 'chapter',
        },
      ],
    })

    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mendapatkan data module id: ${id}`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, no, videoURL, videoDuration } = req.body

    const module = await Module.findByPk(id)
    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    const updateData = {}

    if (name) {
      updateData.name = name
    }

    if (no) {
      const parsedNo = parseInt(no, 10)
      if (Number.isNaN(Number(parsedNo))) {
        return next(new ApiError('Nomor modul harus berupa angka', 400))
      }

      const checkNumber = await Module.findOne({
        where: {
          no: parsedNo,
          chapterId: module.chapterId,
          id: { [Op.not]: id },
        },
      })

      if (checkNumber) {
        return next(
          new ApiError('Nomor modul sudah digunakan dalam chapter ini', 400),
        )
      }
      updateData.no = parsedNo
    }

    if (!videoURL && req.file) {
      const uploadedVideo = await uploadVideo(req.file, next)
      if (!uploadedVideo || Object.keys(uploadedVideo).length === 0) {
        return next(new ApiError('Gagal upload video', 400))
      }
      updateData.videoUrl = uploadedVideo.videoUrl
      updateData.duration = uploadedVideo.videoDuration
    }

    if (videoURL) {
      if (!videoDuration) {
        return next(new ApiError('Harus menyertakan durasi video', 400))
      }

      updateData.videoUrl = videoURL
      updateData.duration = videoDuration
    }

    await module.update(updateData)

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data module id: ${id}`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}
const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params
    const module = await Module.findByPk(id)

    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    const checkChapter = await Chapter.findByPk(module.chapterId)
    if (checkChapter) {
      const checkMyCourse = await MyCourse.findOne({
        where: {
          courseId: checkChapter.courseId,
          isFollowing: true,
        },
      })

      if (checkMyCourse) {
        return next(
          new ApiError(
            'Module ini tidak dapat di hapus karena sudah ada user yang mengikuti course ini',
            400,
          ),
        )
      }
    }

    await module.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus data module id: ${id};`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createModule,
  getAllModule,
  getModuleById,
  deleteModule,
  updateModule,
}
