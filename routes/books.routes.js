import express from "express";

import { booksController, reviewsController } from "../controllers/index.controller.js";
import { bookValidation, updateBookValidation } from "../validations/books.validation.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// BOOKS
router.get('/', booksController.getBooks)
router.get('/:id', booksController.getBookById)
// router.get('/:id/reviews', reviewsController.getReviewsByBookId)`
// router.post('/', authorizeAdmin, bookValidation, booksController.createBook)
// router.put('/:id', authorizeAdmin, updateBookValidation, booksController.updateBook)
router.delete('/:id', authorizeAdmin, booksController.deleteBook)
router.post('/', authorizeAdmin, upload.single('cover'), bookValidation, booksController.createBook)
router.put('/:id', authorizeAdmin, upload.single('cover'), updateBookValidation, booksController.updateBook)

export default router