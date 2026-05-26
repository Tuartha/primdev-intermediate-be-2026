import prisma from '../config/database.config.js'
import { checkValidations } from '../helpers/check-validations.js'
import logger from '../config/logger.config.js'

export const getReviews = async (req, res) => {
    try {
        logger.debug('getReviews: Started')
        const reviews = await prisma.reviews.findMany()

        logger.info({ count: reviews.length }, 'Retrieved reviews from database')
        res.status(200).json({
            "success": true,
            "message": "Reviews retrieved successfully",
            "data": reviews
        })
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to retrieve reviews')
        res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving reviews',
        error: error.message,
        })
    }
}

export const getReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        logger.debug({ reviewId: id}, 'getReviewById: Started')
        const review = await prisma.reviews.findUnique({
            where: {
                id: id
            }
        })

        if(!review) {
            logger.warn({ reviewId: id}, 'Review not found')
            return res.status(404).json({
                success: false,
                message: `Review with id: ${id} not found`
            });
        }

        logger.info({ reviewId: id}, 'Review retrieved successfully')
        res.status(200).json({
            success: true,
            message: 'Review retrieved successfully',
            data: review
        })
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to retrieve review')
        res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving review',
        error: error.message,
        })
    }
}

export const createReview = async (req, res, next) => {
    try {
        logger.debug('createReview: Started')
        const isValid = checkValidations(req, res, next);

        // checkValidations sudah mengirim response 400 jika validasi gagal
        if (isValid !== true) {
        return;
        }

        const { rating, comment, bookId, userId } = req.body
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

        // Cek agar 1 user dapat melakukan review hanya sekali untuk setiap buku
        const existingReview = await prisma.reviews.findFirst({
        where: {
            userId: parseInt(userId),
            bookId: parseInt(bookId),
        },
        })

        if (existingReview) {
            logger.warn({ userId: userId, bookId: bookId }, 'User has already reviewed this book')
            return res.json({
                success: false,
                message: `User with ID: ${userId} has already reviewed book with ID: ${bookId}`,
            })
        }

        logger.debug({ rating, comment, bookId, userId }, 'Creating review')
        const review = await prisma.reviews.create({
            data: {
                rating: parseInt(rating),
                comment,
                bookId: parseInt(bookId),
                userId: parseInt(userId),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        logger.info({ reviewId: review.id }, 'Review created successfully')
        res.json({
            success: true,
            message: 'Review created successfully',
            data: review,
        })
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to create review')
        res.status(500).json({
        success: false,
        message: 'An error occurred while creating review',
        error: error.message,
        })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        logger.debug({ reviewId: id }, 'deleteReview: Started')

        const review = await prisma.reviews.findUnique({
            where: {
                id: id
            }
        })

        if (!review) {
            logger.warn({ reviewId: id }, 'Review not found')
            return res.status(404).json({
                success: false,
                message: `Review with ID: ${id} not found`,
            })
        }

        await prisma.reviews.delete({
            where: {
                id: id
            }
        })

        logger.info({ reviewId: id }, 'Review deleted successfully')
        res.json({
            success: true,
            message: 'Review deleted successfully',
        })
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to delete review')
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting review',
            error: error.message,
        })
    }
}

export const updateReview = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        logger.debug({ reviewId: id }, 'updateReview: Started')

        const isValid = checkValidations(req, res, next);
        if (isValid !== true) {
            return;
        }

        // Mengecek apakah review dengan ID yang diberikan ada di database
        const existingReview = await prisma.reviews.findUnique({
            where: {
                id: id
            }
        })

        if (!existingReview) {
            logger.warn({ reviewId: id }, 'Review not found')
            return res.status(404).json({
                success: false,
                message: `Review with ID: ${id} not found`,
            })
        }

        const { rating, comment } = req.body
        logger.debug({ reviewId: id, rating, comment }, 'Updating review')
        const updatedReview = await prisma.reviews.update({
            where: {
                id: id
            },
            data: {
                rating: rating,
                comment: comment,
            }
        })

        logger.info({ reviewId: id }, 'Review updated successfully')
        res.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview,
        })
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to update review')
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating review',
            error: error.message,
        })
    }
}