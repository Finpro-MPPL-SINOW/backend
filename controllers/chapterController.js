const { Op } = require('sequelize')

const { Module, Chapter, Course } = require('../models')
const ApiError = require('../utils/ApiError')

const createChapter = async (req, res, next) => {
  try {
    let { no } = req.body
    const { name, courseId } = req.body

    const missingFields = ['no', 'name', 'courseId'].filter(
      (field) => !req.body[field],
    )
    if (missingFields.length > 0) {
      return next(
        new ApiError(`Field ${missingFields.join(', ')} harus di isi`, 400),
      )
    }

    if (Number.isNaN(Number(no))) {
      return next(new ApiError('Nomor chapter harus berupa angka', 400))
    }

    no = parseInt(no, 10)

    const checkCourse = await Course.findByPk(courseId)
    if (!checkCourse) {
      return next(
        new ApiError(
          'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
          404,
        ),
      )
    }

    const existingChapter = await Chapter.findOne({
      where: {
        [Op.and]: [
          { courseId },
          {
            [Op.or]: [{ name }, { no }],
          },
        ],
      },
    })

    if (existingChapter) {
      const errorMessage = []

      if (existingChapter.no === no) {
        errorMessage.push('Nomor chapter sudah digunakan dalam course ini')
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(', '), 400))
      }
    }

    const chapter = await Chapter.create({
      no,
      name,
      courseId,
      totalDuration: 0,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil menambahkan data chapter',
      data: chapter,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllChapter = async (req, res, next) => {
  try {
    const chapters = await Chapter.findAll({
      include: [
        {
          model: Module,
          as: 'modules',
        },
      ],
      order: [['id', 'ASC']],
    })

    if (!chapters || chapters.length === 0) {
      return next(new ApiError('Chapter tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data chapter',
      data: chapters,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          model: Module,
          as: 'modules',
        },
      ],
    })

    if (!chapter) {
      return next(new ApiError('Chapter tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mendapatkan data Chapter id: ${id}`,
      data: chapter,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params
    const { no, name } = req.body

    const chapter = await Chapter.findByPk(id)
    if (!chapter) {
      return next(new ApiError('Chapter tidak ditemukan', 404))
    }

    const updateData = {}

    if (no) {
      const parsedNo = parseInt(no, 10)
      if (Number.isNaN(Number(parsedNo))) {
        return next(new ApiError('Nomor chapter harus berupa angka', 400))
      }

      const checkNumber = await Chapter.findOne({
        where: {
          no: parsedNo,
          courseId: chapter.courseId,
          id: { [Op.not]: id },
        },
      })

      if (checkNumber) {
        return next(
          new ApiError('Nomor chapter sudah digunakan dalam course ini', 400),
        )
      }
      updateData.no = no
    }

    if (name) {
      updateData.name = name
    }

    await chapter.update(updateData)

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data chapter id: ${id}`,
      data: chapter,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}
const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          model: Module,
          as: 'modules',
        },
      ],
    })

    if (!chapter) {
      return next(new ApiError('Chapter tidak ditemukan', 404))
    }
    await chapter.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus data Chapter id: ${id};`,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createChapter,
  getAllChapter,
  getChapterById,
  deleteChapter,
  updateChapter,
}
