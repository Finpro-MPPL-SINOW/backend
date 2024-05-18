const { Op } = require('sequelize')

const { Benefit, Course } = require('../models')
const ApiError = require('../utils/ApiError')

const createBenefit = async (req, res, next) => {
  try {
    let { no } = req.body
    const { description, courseId } = req.body

    no = parseInt(no, 10)

    const missingFields = ['no', 'description', 'courseId'].filter(
      (field) => !req.body[field],
    )
    if (missingFields.length > 0) {
      return next(
        new ApiError(`Field ${missingFields.join(', ')} harus di isi`, 400),
      )
    }

    if (Number.isNaN(Number(no))) {
      return next(new ApiError('Nomor benefit harus berupa angka', 400))
    }

    const existingBenefit = await Benefit.findOne({
      where: {
        [Op.and]: [
          { courseId },
          {
            [Op.or]: [{ no }, { description }],
          },
        ],
      },
    })

    if (existingBenefit) {
      const errorMessage = []

      if (existingBenefit.no === no) {
        errorMessage.push('Nomor benefit sudah digunakan dalam course ini')
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(', '), 400))
      }
    }

    const checkCourse = await Course.findByPk(courseId)
    if (!checkCourse) {
      return next(
        new ApiError(
          'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
          404,
        ),
      )
    }

    const benefit = await Benefit.create({
      no,
      description,
      courseId,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil menambahkan data benefit',
      data: benefit,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllBenefit = async (req, res, next) => {
  try {
    const benefits = await Benefit.findAll({
      order: [['id', 'ASC']],
    })

    if (!benefits || benefits.length === 0) {
      return next(new ApiError('Benefit tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data benefit',
      data: benefits,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const getBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params

    const benefit = await Benefit.findByPk(id)

    if (!benefit) {
      return next(new ApiError('Benefit tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mendapatkan data Benefit id: ${id}`,
      data: benefit,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params
    const { no, description } = req.body

    const benefit = await Benefit.findByPk(id)
    if (!benefit) {
      return next(new ApiError('Benefit tidak ditemukan', 404))
    }

    const updateData = {}

    if (no) {
      const parsedNo = parseInt(no, 10)
      if (Number.isNaN(Number(parsedNo))) {
        return next(new ApiError('Nomor benefit harus berupa angka', 400))
      }

      const checkNumber = await Benefit.findOne({
        where: {
          no: parsedNo,
          courseId: benefit.courseId,
          id: { [Op.not]: id },
        },
      })

      if (checkNumber) {
        return next(
          new ApiError('Nomor benefit sudah digunakan dalam course ini', 400),
        )
      }
      updateData.no = no
    }

    if (description) {
      updateData.description = description
    }

    await benefit.update(updateData)

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data benefit id: ${id}`,
      data: benefit,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params

    const benefit = await Benefit.findByPk(id)

    if (!benefit) {
      return next(new ApiError('Benefit tidak ditemukan', 404))
    }

    await benefit.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus data Benefit id: ${id};`,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createBenefit,
  getAllBenefit,
  getBenefitById,
  deleteBenefit,
  updateBenefit,
}
