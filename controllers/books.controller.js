import prisma from "../config/database.config.js";
import { isCategoryExist } from "./categories.controller.js";
// import { validationResult } from 'express-validator';
import { checkValidations } from "../helpers/check-validations.js";
import { getFileUrl, uploadFile } from './cloudinary.controller.js'
import logger from '../config/logger.config.js'

export const getBooks = async (req, res) => {
  try {
	  // Tambahkan logger
    logger.debug('getBooks: Started')
    const books = await prisma.books.findMany()
    
	  // Tambahkan logger
    logger.info({ count: books.length }, 'Retrieved books from database')

    books.forEach((book) => {
      if (!book.cloudinaryId) {
        book.coverUrl = null
      } else {
        book.coverUrl = getFileUrl(book.cloudinaryId)
      }
    })
	  // Tambahkan logger
    logger.debug('Generated cover URLs for all books')

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    })
  } catch (error) {
	  // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve books')

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving books',
      error: error.message,
    })
  }
};

export const getBookById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
	  // Tambahkan logger
    logger.debug({ bookId: id }, 'getBookById: Started')

    const book = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!book) {
		  // Tambahkan logger
      logger.warn({ bookId: id }, 'Book not found')
      return res.status(404).json({
        success: false,
        message: `Book with ID: ${id} not found`,
      })
    }

    if (book.cloudinaryId) {
      book.coverUrl = getFileUrl(book.cloudinaryId)
    } else {
      book.coverUrl = null
    }
	  // Tambahkan logger
    logger.info({ bookId: id }, 'Book retrieved successfully')

    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    })
  } catch (error) {
	  // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve book')
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving book',
      error: error.message,
    })
  }
};

export const createBook = async (req, res, next) => {
  try {
	  // Tambahkan logger
    logger.debug({ body: req.body }, 'createBook: Started')

    const validationErrors = checkValidations(req, res, next)

    if (!validationErrors.isEmpty()) {
		  // Tambahkan logger
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const { categoryId, title, author, year } = req.body

	  // Tambahkan logger
    logger.debug({ categoryId }, 'Checking if category exists')
    const categoryExists = await isCategoryExist(categoryId)

    if (!categoryExists) {
		  // Tambahkan logger
      logger.warn({ categoryId }, 'Category not found')
      return res.status(404).json({
        success: false,
        message: `Category with ID: ${categoryId} not found`,
      })
    }

    const cover = req.file
    let cloudinaryId = null

    if (cover) {
		  // Tambahkan logger
      logger.debug(
        { fileName: cover.filename },
        'Uploading cover to Cloudinary',
      )
      const result = await uploadFile(cover)
      cloudinaryId = result.public_id
		  // Tambahkan logger
      logger.info({ cloudinaryId }, 'Cover uploaded successfully')
    }

	  // Tambahkan logger
    logger.debug(
      { title, author, year, categoryId },
      'Creating book in database',
    )
    const book = await prisma.books.create({
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

	  // Tambahkan logger
    logger.info({ bookId: book.id, title }, 'Book created successfully')
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    })
  } catch (error) {
	  // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to create book')
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating book',
      error: error.message,
    })
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
	  // Tambahkan logger
    logger.debug({ bookId: id, body: req.body }, 'updateBook: Started')

    const validationErrors = checkValidations(req, res, next)

    if (!validationErrors.isEmpty()) {
		  // Tambahkan logger
      logger.warn(
        { bookId: id, errors: validationErrors.array() },
        'Validation failed',
      )
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const { categoryId, title, author, year } = req.body
    
	  // Tambahkan logger
    logger.debug({ bookId: id }, 'Finding book in database')
    const book = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!book) {
		  // Tambahkan logger
      logger.warn({ bookId: id }, 'Book not found')
      return res.status(404).json({
        success: false,
        message: `Book with ID: ${id} not found`,
      })
    }

    if (categoryId) {
		  // Tambahkan logger
      logger.debug({ categoryId }, 'Checking if category exists')
      const categoryExists = await isCategoryExist(categoryId)

      if (!categoryExists) {
			  // Tambahkan logger
        logger.warn({ bookId: id, categoryId }, 'Category not found')
        return res.status(404).json({
          success: false,
          message: `Category with ID: ${categoryId} not found`,
        })
      }
    }

    const cover = req.file
    let cloudinaryId = book.cloudinaryId

    if (cover) {
      if (book.cloudinaryId) {
			  // Tambahkan logger
        logger.debug(
          { bookId: id, oldCloudinaryId: book.cloudinaryId },
          'Deleting old cover',
        )
        await deleteFile(book.cloudinaryId)
      }

		  // Tambahkan logger
      logger.debug(
        { bookId: id, fileName: cover.filename },
        'Uploading new cover to Cloudinary',
      )
      const result = await uploadFile(cover)
      cloudinaryId = result.public_id
		  // Tambahkan logger
      logger.info({ bookId: id, cloudinaryId }, 'Cover uploaded successfully')
    }

	  // Tambahkan logger
    logger.debug(
      { bookId: id, updates: { title, author, year, categoryId } },
      'Updating book',
    )
    await prisma.books.update({
      where: {
        id: id,
      },
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

	  // Tambahkan logger
    logger.info({ bookId: id, title }, 'Book updated successfully')
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    })
  } catch (error) {
	  // Tambahkan logger
    logger.error(
      { bookId: req.params.id, error: error.message },
      'Failed to update book',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating book',
      error: error.message,
    })
  }
};

export const deleteBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
	  // Tambahkan logger
    logger.debug({ bookId: id }, 'deleteBook: Started')

	  // Tambahkan logger
    logger.debug({ bookId: id }, 'Finding book in database')
    const book = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!book) {
		  // Tambahkan logger
      logger.warn({ bookId: id }, 'Book not found')
      return res.status(404).json({
        success: false,
        message: `Book with ID: ${id} not found`,
      })
    }

    if (book.cloudinaryId) {
		  // Tambahkan logger
      logger.debug(
        { bookId: id, cloudinaryId: book.cloudinaryId },
        'Deleting cover from Cloudinary',
      )
      await deleteFile(book.cloudinaryId)
    }

	  // Tambahkan logger
    logger.debug({ bookId: id }, 'Deleting book from database')
    await prisma.books.delete({
      where: {
        id: id,
      },
    })

	  // Tambahkan logger
    logger.info({ bookId: id }, 'Book deleted successfully')
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    })
  } catch (error) {
	  // Tambahkan logger
    logger.error(
      { bookId: req.params.id, error: error.message },
      'Failed to delete book',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting book',
      error: error.message,
    })
  }
};

export const isBookExist = async (id) => {
  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  return !!book
}
