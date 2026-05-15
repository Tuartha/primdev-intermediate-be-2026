import express from "express";

import { categoriesController } from "../controllers/index.controller.js";
import { categoryValidation, updateCategoryValidation } from "../validations/categories.validation.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router()

// CATEGORIES
router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getCategoryId)
router.post('/', authorizeAdmin, categoryValidation, categoriesController.createCategory)
router.put('/:id', authorizeAdmin, updateCategoryValidation, categoriesController.updateCategory)
router.delete('/:id', authorizeAdmin, categoriesController.deleteCategory)

export default router