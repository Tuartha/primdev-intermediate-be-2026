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

    const isValid = checkValidations(req, res, next);

    // checkValidations sudah mengirim response 400 jika validasi gagal
    if (isValid !== true) {
      return;
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

    const isValid = checkValidations(req, res, next);

    // checkValidations sudah mengirim response 400 jika validasi gagal
    if (isValid !== true) {
      return;
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

export const filterBooks = async (req, res) => {
  try {
    logger.debug({ query: req.query }, 'filterBooks: Started')

    const {
      categories,
      author,
      yearMin,
      yearMax,
      ratingMin, 
      available,
      sortBy,
      sortOrder,
      page = 1,
      limit = 20,
    } = req.query

    const where = {}

    if (categories) {
      const categoryIds = categories.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id))
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds }
      }
    }

    if (author && author.trim() !== '') {
      where.author = {contains: author.trim(), mode: 'insensitive'}
    }

    if (yearMin || yearMax) {
      where.year = {}
      if (yearMin) where.year.gte = parseInt(yearMin)
      if (yearMax) where.year.lte = parseInt(yearMax)
    }

    if(available !== undefined && available !== null) {
      where.available = available === true || available === 'true'
    }
    logger.debug({ where }, 'Dynamic where clause built')

    let orderBy = {}
    const order = sortOrder === 'desc' ? 'desc' : 'asc'
    switch (sortBy) {
      case 'title':
        orderBy = { title: order }
        break
      case 'year':
        orderBy = { year: order }
        break
      case 'rating':
        orderBy = null 
        break
      case 'popularity':
        orderBy = null
        break
      default:
        orderBy = { title: 'asc' }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const booksQuery ={
      where: where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            borrowings: true,  // Untuk popularity sort
          },
        },
      },
    }

    if (orderBy) {
      booksQuery.orderBy = orderBy
      booksQuery.skip = skip
      booksQuery.take = parseInt(limit)
    }

     const [booksRaw, totalBooks] = await Promise.all([
      prisma.books.findMany(booksQuery),
      prisma.books.count({ where }),
    ])

    let books = booksRaw.map((book) => {
      const ratings = book.reviews.map((r) => r.rating)
      const avgRating =
        ratings.length > 0 ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        year: book.year,
        available: book.available,
        totalCopies: book.totalCopies,
        category: book.categories,
        coverUrl: book.cloudinaryId ? getFileUrl(book.cloudinaryId) : null,
        averageRating: avgRating,
        totalReviews: ratings.length,
        borrowCount: book._count.borrowings, // Popularity metric
      }
    })

    if (ratingMin) {
      const minRating = parseFloat(ratingMin)
      books = books.filter((book) => book.averageRating >= minRating)
    }
    
    if (sortBy === 'rating') {
      books.sort((a, b) =>
        order === 'desc'
          ? b.averageRating - a.averageRating
          : a.averageRating - b.averageRating,
      )
    } else if (sortBy === 'popularity') {
      books.sort((a, b) =>
        order === 'desc'
          ? b.borrowCount - a.borrowCount
          : a.borrowCount - b.borrowCount,
      )
    }

    let paginatedBooks = books
    let finalTotal = totalBooks
    if (!orderBy) {
      finalTotal = books.length
      paginatedBooks = books.slice(skip, skip + parseInt(limit))
    }

    const [allCategories, distinctAuthors, yearRange] = await Promise.all([
      prisma.categories.findMany({
        where: {
          books: { some: {} },
        },
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
        },
        orderBy: { name: 'asc' },
      }),
      // Distinct authors
      prisma.books.findMany({
        distinct: ['author'],
        select: { author: true },
        orderBy: { author: 'asc' },
      }),
      // Year range (min dan max year yang ada di database)
      prisma.books.aggregate({
        _min: { year: true },
        _max: { year: true },
      }),
    ])
    const totalPages = Math.ceil(finalTotal / parseInt(limit))
    logger.info(
      { totalBooks: finalTotal, appliedFilters: Object.keys(where).length },
      'Filter completed',
    )
    res.status(200).json({
      success: true,
      message: 'Filtered books retrieved successfully',
      data: {
        books: paginatedBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks: finalTotal,
          perPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
        // Aggregation: info untuk UI dropdown / sidebar filter
        filterOptions: {
          categories: allCategories.map((c) => ({
            id: c.id,
            name: c.name,
            bookCount: c._count.books,
          })),
          authors: distinctAuthors.map((a) => a.author),
          yearRange: {
            min: yearRange._min.year,
            max: yearRange._max.year,
          },
        },
        // Info filter yang sedang aktif
        appliedFilters: {
          categories: categories || null,
          author: author || null,
          yearRange:
            yearMin || yearMax
              ? { min: yearMin || null, max: yearMax || null }
              : null,
          ratingMin: ratingMin || null,
          available: available !== undefined ? available : null,
          sortBy,
          sortOrder: order,
        },
      },
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to filter books')
    res.status(500).json({
      success: false,
      message: 'An error occurred while filtering books',
      error: error.message,
    })
  }
}
