import prisma from '../config/database.config.js'   
import logger from '../config/logger.config.js'

export const getAllBorrowings = async (req, res) => {
  try {
    logger.debug('getAllBorrowings: Started')
    // Mengambil semua peminjaman dari database menggunakan Prisma Client
    const borrowings = await prisma.borrowings.findMany({
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    logger.debug('getAllBorrowings: Successfully retrieved borrowings', { count: borrowings.length })
    res.json({
      success: true,
      message: 'Borrowings retrieved successfully',
      data: borrowings,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to retrieve borrowings')

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving borrowings',
      error: error.message,
    })
  }
}

export const getBorrowingById = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)
    logger.debug({ borrowingId: id }, 'getBorrowingById: Started')

    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id) },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      logger.warn({ borrowingId: id }, 'Borrowing not found')
      return res.json({
        success: false,
        message: `Borrowing with ID: ${id} not found`,
      })
    }

    logger.info({ borrowingId: id }, 'Borrowing retrieved successfully')
    res.json({
      success: true,
      message: 'Borrowing retrieved successfully',
      data: borrowing,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to retrieve borrowings')

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving borrowings',
      error: error.message,
    })
  }
}

export const createBorrowing = async (req, res) => {
  try {
    logger.debug({ body: req.body }, 'createBorrowing: Started')
    // Mendapatkan data userId dan bookId dari body request
    const { userId, bookId } = req.body

    // Mengecek apakah user dengan ID yang diberikan ada di database menggunakan fungsi isUserExist
    logger.debug({ userId: userId }, 'Checking if user exists')
    const userExists = await isUserExist(userId)

    if (!userExists) {
      logger.warn({ userId: userId }, 'User not found')
      return res.json({
        success: false,
        message: `User with ID: ${userId} not found`,
      })
    }

    // Mengecek apakah buku dengan ID yang diberikan ada di database menggunakan fungsi isBookExist
    logger.debug({ bookId: bookId }, 'Checking if book exists')
    const bookExists = await isBookExist(bookId)

    if (!bookExists) {
      logger.warn({ bookId: bookId }, 'Book not found')
      return res.json({
        success: false,
        message: `Book with ID: ${bookId} not found`,
      })
    }

    const borrowing = await prisma.borrowings.create({
      data: {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
      },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    logger.debug({ borrowingId: borrowing.id }, 'Borrowing created successfully')
    // Update ketersediaan buku menjadi false setelah dipinjam
    await prisma.books.update({
      where: { id: parseInt(bookId) },
      data: { available: false },
    })

    logger.info({ borrowingId: borrowing.id }, 'Borrowing created and book availability updated successfully')
    res.json({
      success: true,
      message: 'Borrowing created successfully',
      data: borrowing,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to create borrowing')
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating borrowing',
      error: error.message,
    })
  }
}

export const returnBook = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan dikembalikan dari parameter URL
    const { id } = req.params

    // Mencari peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    logger.debug({ borrowingId: id }, 'returnBook: Started')
    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id) },
    })

    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      logger.warn({ borrowingId: id }, 'Borrowing not found')
      return res.json({
        success: false,
        message: 'Borrowing not found',
      })
    }

    logger.debug({ borrowingId: id }, 'Borrowing found')
    // Cek apakah buku sudah dikembalikan
    if (borrowing.returned_at) {
      logger.warn({ borrowingId: id }, 'Book already returned')
      return res.json({
        success: false,
        message: 'Book already returned',
      })
    }

    // Update peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    const returnedBorrowing = await prisma.borrowings.update({
      where: { id: parseInt(id) },
      data: { returned_at: new Date() },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Update ketersediaan buku menjadi true setelah dikembalikan
    await prisma.books.update({
      where: { id: returnedBorrowing.bookId },
      data: { available: true },
    })

    logger.info({ borrowingId: id }, 'Book returned successfully')
    res.json({
      success: true,
      message: 'Book returned successfully',
      data: returnedBorrowing,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to return book')
    res.status(500).json({
      success: false,
      message: 'An error occurred while returning book',
      error: error.message,
    })
  }
}

export const deleteBorrowing = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan dihapus dari parameter URL
    const id = parseInt(req.params.id)
    logger.debug({ borrowingId: id }, 'deleteBorrowing: Started')

    // Mencari peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    logger.debug({ borrowingId: id }, 'Finding borrowing in database')
    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id) },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    logger.debug({ borrowingId: id }, 'Borrowing found')
    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      logger.warn({ borrowingId: id }, 'Borrowing not found')
      return res.json({
        success: false,
        message: 'Borrowing not found',
      })
    }

    // Hapus peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    logger.debug({ borrowingId: id }, 'Deleting borrowing from database')
    await prisma.borrowings.delete({ where: { id: parseInt(id) } })

    // Update ketersediaan buku menjadi true jika buku belum dikembalikan
    if (!borrowing.returned_at) {
      logger.debug({ borrowingId: id }, 'Updating book availability')
      await prisma.books.update({
        where: { id: borrowing.bookId },
        data: { available: true },
      })
    }

    logger.info({ borrowingId: id }, 'Borrowing deleted successfully')
    res.json({
      success: true,
      message: 'Borrowing deleted successfully',
      data: borrowing,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to return book')
    res.status(500).json({
      success: false,
      message: 'An error occurred while returning book',
      error: error.message,
    })
  }
}