import {body} from 'express-validator'

export const reviewValidation = [
    body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

    body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters long')
    .trim(),

    body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isInt()
    .withMessage('Book ID must be an integer')
    .toInt(),

    body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer')
    .toInt(),
]

export const updateReviewValidation = [
    body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

    body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters long')
    .trim(),

    body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isInt()
    .withMessage('Book ID must be an integer')
    .toInt(),

    body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer')
    .toInt(),
]