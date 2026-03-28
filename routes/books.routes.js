import express from "express";

import { booksController } from "../controllers/index.controller.js";

const router = express.Router()

// BOOKS
router.get('/', booksController.getBooks)
router.get('/:id', booksController.getBookById)
router.post('/', booksController.createBook)
router.put('/:id', booksController.updateBook)
router.delete('/:id', booksController.deleteBook)

export default router