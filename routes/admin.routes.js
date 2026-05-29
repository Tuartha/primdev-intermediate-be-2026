import express from 'express'
import { adminStatsController } from '../controllers/index.controller.js'
import { authorizeAdmin } from '../middleware/admin.middleware.js'
import { adminStatsValidation } from '../validations/adminStats.validation.js'

const router = express.Router()
router.get(
  '/statistics',
  authorizeAdmin,
  adminStatsValidation,
  adminStatsController.getStatistics,
)

export default router