import express from "express";

import { categoriesController } from "../controllers/index.controller.js";

const router = express.Router()

// CATEGORIES
router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getCategoryId)
router.post('/', categoriesController.createCategory)
router.put('/:id', categoriesController.updateCategory)
router.delete('/:id', categoriesController.deleteCategory)

export default router