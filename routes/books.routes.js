import express from "express";

import { booksController } from "../controllers/index.controller.js";
import { bookValidation, updateBookValidation } from "../validations/books.validation.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router()

// BOOKS
router.get('/', booksController.getBooks)
router.get('/:id', booksController.getBookById)
router.post('/', authorizeAdmin, bookValidation, booksController.createBook)
router.put('/:id', authorizeAdmin, updateBookValidation, booksController.updateBook)
router.delete('/:id', authorizeAdmin, booksController.deleteBook)

export default router