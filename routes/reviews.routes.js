import express from "express";

import { reviewsController } from "../controllers/index.controller.js";
import { reviewValidation, updateReviewValidation } from "../validations/reviews.validation.js";

const router = express.Router()

// REVIEWS
router.get('/', reviewsController.getReviews)
router.get('/:id', reviewsController.getReviewById)
router.post('/', reviewValidation, reviewsController.createReview)
router.put('/:id', updateReviewValidation, reviewsController.updateReview)
router.delete('/:id', reviewsController.deleteReview)

export default router