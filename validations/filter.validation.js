import { query } from 'express-validator';

export const filterValidation = [
  query('categories')
    .optional()
    .isString()
    .withMessage('Categories must be a comma-separated string of IDs')
    .custom((value) => {
      const ids = value.split(',').map((id) => id.trim())
      for (const id of ids) {
        if (isNaN(parseInt(id))) {
          throw new Error(`Invalid category ID: "${id}" is not a number`)
        }
      }
      return true
    }),

  query('author')
    .optional()
    .isString()
    .withMessage('Author must be a string')
    .trim(),

  query('yearMin')
    .optional()
    .isInt({ min: 1000 })
    .withMessage('yearMin must be a valid year (integer >= 1000)')
    .toInt(),
    
  query('yearMax')
    .optional()
    .isInt({ min: 1000 })
    .withMessage('yearMax must be a valid year (integer >= 1000)')
    .toInt(),

  query('yearMax').custom((value, { req }) => {
    if (req.query.yearMin && value) {
      const min = parseInt(req.query.yearMin)
      const max = parseInt(value)
      if (min > max) {
        throw new Error('yearMin cannot be greater than yearMax')
      }
    }
    return true
  }),

  query('ratingMin')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('ratingMin must be a number between 1 and 5')
    .toFloat(),

  query('available')
    .optional()
    .isBoolean()
    .withMessage('available must be true or false')
    .toBoolean(),

  query('sortBy')
    .optional()
    .isIn(['title', 'rating', 'year', 'popularity'])
    .withMessage('sortBy must be one of: title, rating, year, popularity'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100')
    .toInt(),
]