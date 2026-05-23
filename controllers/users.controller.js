import prisma from '../config/database.config.js'
import { checkValidations } from '../helpers/check-validations.js'
import logger from '../config/logger.config.js'

export const getUsers = async (req, res) => {
  try {
    logger.debug('getUsers: Started')
    const users = await prisma.users.findMany()
  
    logger.info({ count: users.length }, 'Retrieved users from database')
    res.status(200).json({
      "success": true,
      "message": "Users retrieved successfully",
      "data": users
    })
  } catch (error) {
    // Tambahkan logger
    logger.error(
      { error: error.message },
      'Failed to get user',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user',
      error: error.message,
    })
  }
}

export const getUserId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    logger.debug({ userId: id }, 'getUserId: Started')
    const user = await prisma.users.findUnique({
      where: {
        id: id
      },
      include: {
        profiles: {
          select: {
            address: true,
            phone: true
          }
        }
      }
    })

    if (!user) {
      logger.warn({ userId: id }, 'User not found')
      res.status(404).send(`Users with id: ${id} not found`);
    }

    logger.info({ userId: id }, 'Retrieved user from database')
    res.status(200).json({
      "success": true,
      "message": "User retrieved successfully",
      "data": user
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve user')
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user',
      error: error.message,
    })
  }
} 

export const createUser = async (req, res, next) => {
  try {
    logger.debug('createUser: Started')
    const validationErrors = checkValidations(req, res, next);

    if (!validationErrors.isEmpty()) {
		  // Tambahkan logger
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const { name, email, password } = req.body;

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password
      }
    })

    logger.info({ userId: user.id }, 'User created successfully')
    res.status(201).json({
      "success": true,
      "message": "Users created successfully",
      "data": user
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to create user')
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating user',
      error: error.message,
    })
  }
}

export const updateUser = async (req, res, next) => {
  try {
    logger.debug('updateUser: Started')
    const validationErrors = checkValidations(req, res, next);

    if (!validationErrors.isEmpty()) {
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;

    logger.debug({ userId: id }, 'Finding user in database')
    const user = await prisma.users.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      logger.warn({ userId: id }, 'User not found')
      res.status(404).send(`User with ID: ${id} not found`)
      return
    }

    await prisma.users.update({
      where: {
        id: id
      },
      data: {
        name,
        email, 
        password
      }
    })

    logger.info({ userId: id }, 'User updated successfully')
    res.status(200).json({
      "success": true,
      "message": "Users updated successfully",
      "data": user
    })
  } catch (error) {
    // Tambahkan logger
    logger.error(
      { userId: req.params.id, error: error.message },
      'Failed to update user',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating user',
      error: error.message,
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    logger.debug('deleteUser: Started')
    const id = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      logger.warn({ userId: id }, 'User not found')
      res.status(404).send(`User with ID: ${id} not found`)
      return
    }

    logger.info({ userId: id }, 'Deleting user from database')
    await prisma.users.delete({
      where: {
        id: id
      }
    })

    logger.info({ userId: id }, 'User deleted successfully')
    res.status(200).json({
      "success": true,
      "message": "User deleted successfully",
      "data": user
    })
  } catch (error) {
    logger.error({ userId: req.params.id, error: error.message }, 'Failed to delete user')
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting user',
      error: error.message,
    })
  }
}

export const isUserExist = async (id) => {
  // Mencari pengguna dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  })

  return !!user
}