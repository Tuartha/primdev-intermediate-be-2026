import { query } from 'express-validator'

export const adminStatsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage(
      'startDate must be a valid date in ISO 8601 format (YYYY-MM-DD)',
    )
    .toDate(),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage(
      'endDate must be a valid date in ISO 8601 format (YYYY-MM-DD)',
    )
    .toDate(),

  query('endDate').custom((value, { req }) => {
    if (req.query.startDate && value) {
      const start = new Date(req.query.startDate)
      const end = new Date(value)
      if (start > end) {
        throw new Error('startDate cannot be after endDate')
      }
    }
    return true
  }),

  query('trend')
    .optional()
    .isIn(['weekly', 'monthly'])
    .withMessage('trend must be either "weekly" or "monthly"'),
]