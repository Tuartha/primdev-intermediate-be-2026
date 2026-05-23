import prisma from '../config/database.config.js'
import { checkValidations } from '../helpers/check-validations.js'
import logger from '../config/logger.config.js'

export const getCategories = async (req, res) => {
  try {
    logger.debug('getCategories: Started')
    const categories = await prisma.categories.findMany()
  
    logger.info({ count: categories.length }, 'Categories retrieved from database')
    res.status(200).json({
      "success": true,
      "message": "Categories retrieved successfully",
      "data": categories
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve categories')

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving categories',
      error: error.message,
    })
  }
}

export const getCategoryId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.debug({ categoryId: id }, 'getCategoryId: Started')

    const category = await prisma.categories.findUnique({
      where: {
        id: id
      }
    })

    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      res.status(404).send(`Category with id: ${id} not found`);
    }

    logger.info({ categoryId: id }, 'Category retrieved successfully')
    res.status(200).json({
      "success": true,
      "message": "Category retrieved successfully",
      "data": category
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve categories')
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving categories',
      error: error.message,
    })
  } 
}

export const createCategory = async (req, res, next) => {
  try {
    const validartionErrors = checkValidations(req, res, next);

    if (!validationErrors.isEmpty()) {
		  // Tambahkan logger
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const { name } = req.body;

    logger.debug({ name }, 'createCategory: Started')
    const category = await prisma.categories.create({
      data: {
        name
      }
    })

    logger.info({ categoryId: category.id }, 'Category created successfully')
    res.status(201).json({
      "success": true,
      "message": "Category created successfully",
      "data": category
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to create category')
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating category',
      error: error.message,
    })
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const validationErrors = checkValidations(req, res, next);

    if (!validationErrors.isEmpty()) {
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const id = parseInt(req.params.id);
    const { name } = req.body;
      
    logger.debug({ categoryId: id, name }, 'updateCategory: Started')
    const category = await prisma.categories.findUnique({
      where: {
        id: id
      }
    })

    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      res.status(404).send(`Category with ID: ${id} not found`)
      return
    }

    await prisma.categories.update({
      where: {
        id: id
      },
      data: {
        name
      }
    })
    logger.info({ categoryId: id }, 'Category updated successfully')
    res.status(200).json({
      "success": true,
      "message": "Category updated successfully",
      "data": category
    })
  } catch (error) {
    logger.error({ categoryId: req.params.id, error: error.message }, 'Failed to update category')
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating category',
      error: error.message,
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    logger.debug({ categoryId: id }, 'deleteCategory: Started')
    const category = await prisma.categories.findUnique({
      where: {
        id: id
      }
    })

    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      res.status(404).send(`Category with ID: ${id} not found`)
      return
    }

    await prisma.categories.delete({
      where: {
        id: id
      }
    })

    logger.info({ categoryId: id }, 'Category deleted successfully')
    res.status(200).json({
      "success": true,
      "message": "Category deleted successfully",
      "data": category
    })
  } catch (error) {
    // Tambahkan logger
    logger.error(
      { categoryId: req.params.id, error: error.message },
      'Failed to delete category',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting category',
      error: error.message,
    })
  }
}

export const isCategoryExist = async (id) => {
  // Mencari kategori dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  return !!category
}