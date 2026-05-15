import express from "express";

import { borrowingsController } from "../controllers/index.controller.js";

const router = express.Router()

// BORROWINGS
router.get('/', borrowingsController.getAllBorrowings)
router.get('/:id', borrowingsController.getBorrowingById)
router.post('/', borrowingsController.createBorrowing)
router.put('/:id/return', borrowingsController.returnBook)
router.delete('/:id', borrowingsController.deleteBorrowing)

export default router