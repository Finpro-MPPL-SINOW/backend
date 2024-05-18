const { Op } = require('sequelize')

const { Category, Course } = require('../models')
const ApiError = require('../utils/ApiError')

const { uploadImage } = require('../utils/imagekitUploader')

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body

    if (!name) {
      return next(new ApiError('Name harus diisi', 400))
    }

    const existingCategory = await Category.findOne({
      where: {
        name,
      },
    })

    if (existingCategory) {
      return next(new ApiError('Nama category sudah ada', 400))
    }

    if (!req.file) {
      return next(new ApiError('Harus menyertakan gambar', 400))
    }

    const { imageUrl } = await uploadImage(req.file, next)

    const category = await Category.create({
      name,
      imageUrl,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil menambahkan data category',
      data: category,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const getAllCategory = async (req, res, next) => {
  try {
    const { name, isPopular, sortByName } = req.query

    const where = {}
    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      }
    }

    if (isPopular) {
      if (isPopular === 'true') {
        where.isPopular = true
      } else if (isPopular === 'false') {
        where.isPopular = false
      } else {
        return next(new ApiError('isPopular harus true atau false', 400))
      }
    }

    const categories = await Category.findAll({
      where,
      order: sortByName ? [['name', 'asc']] : [['id', 'ASC']],
    })

    if (!categories || categories.length === 0) {
      return next(new ApiError('Category tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data category',
      data: categories,
    })
  } catch (error) {
    return next(new ApiError((error.message, 500)))
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id)
    if (!category) {
      return next(new ApiError('Category tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mendapatkan data category id: ${id}`,
      data: category,
    })
  } catch (error) {
    return next(new ApiError((error.message, 500)))
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.params

    const updateData = {}

    const category = await Category.findByPk(id)

    if (!category) {
      return next(new ApiError('Category tidak ditemukan', 404))
    }

    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      updateData.name = name
    }

    if (req.file) {
      const { imageUrl } = await uploadImage(req.file, next)
      updateData.imageUrl = imageUrl
    }

    if (Object.keys(updateData).length !== 0) {
      category.update(updateData)
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data category id: ${id}`,
      data: category,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id)
    if (!category) {
      return next(new ApiError('Category tidak ditemukan', 404))
    }

    const checkCourse = await Course.findOne({
      where: {
        categoryId: id,
      },
    })

    if (checkCourse) {
      return next(
        new ApiError(
          'Gagal menghapus kategory karena sudah ada course dengan kategory ini',
          400,
        ),
      )
    }

    await category.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus data category dengan id: ${id}`,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
}
