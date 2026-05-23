import prisma from '../config/database.config.js'
import logger from '../config/logger.config.js'

export const getProfiles = async (req, res) => {
  try {
    logger.debug('getProfiles: Started')
    const profiles = await prisma.profiles.findMany()
  
    logger.info({ count: profiles.length }, 'Retrieved profiles from database')
    res.status(200).json({
      "success": true,
      "message": "Profiles retrieved successfully",
      "data": profiles
    })
  } catch (error) {
    // Tambahkan logger
    logger.error(
      { error: error.message },
      'Failed to get profile',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving profile',
      error: error.message,
    })
  }
}

export const getProfileId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    logger.debug({ profileId: id }, 'getProfileId: Started')
    const profile = await prisma.profiles.findUnique({
      where: {
        id: id
      }
    })

    if (!profile) {
      logger.warn({ profileId: id }, 'Profile not found')
      res.status(404).send(`Profile with id: ${id} not found`);
    }

    logger.info({ profileId: id }, 'Retrieved profile from database')
    res.json({
      "success": true,
      "message": "Profile retrieved successfully",
      "data": profile
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to retrieve profile')

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving profile',
      error: error.message,
    })
  }
}

export const createProfile = async (req, res) => {
  try {
    const { userId, address, phone } = req.body;

    logger.debug({ userId }, 'createProfile: Started')
    const profile = await prisma.profiles.create({
      data: {
        userId,
        address,
        phone
      }
    })

    logger.info({ profileId: profile.id }, 'Profile created successfully')
    res.status(200).json({
      "success": true,
      "message": "Profile created successfully",
      "data": profile
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to create profile')

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating profile',
      error: error.message,
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId, address, phone } = req.body;
    logger.debug({ profileId: id, userId }, 'updateProfile: Started')

    const profile = await prisma.profiles.findUnique({
      where: {
        id: id
      }
    })

    if (!profile) {
      logger.warn({ profileId: id }, 'Profile not found')
      res.status(404).send(`Profile with ID: ${id} not found`)
      return
    }

    await prisma.profiles.update({
      where: {
        id: id
      },
      data: {
          userId,
        address,
        phone
      }
    })

    logger.info({ profileId: id }, 'Profile updated successfully')
    res.status(200).json({
      "success": true,
      "message": "Profile updated successfully",
      "data": profile
    })
  } catch (error) {
    // Tambahkan logger
    logger.error({ error: error.message }, 'Failed to update profile')

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile',
      error: error.message,
    })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    logger.debug({ profileId: id }, 'deleteProfile: Started')
    const profile = await prisma.profiles.findUnique({
      where: {
        id: id
      }
    })

    if (!profile) {
      logger.warn({ profileId: id }, 'Profile not found')
      res.status(404).send(`Profile with ID: ${id} not found`)
      return
    }

    await prisma.profiles.delete({
      where: {
        id: id
      }
    })

    logger.info({ profileId: id }, 'Profile deleted successfully')
    res.status(200).json({
      "success": true,
      "message": "Profile deleted successfully",
      "data": profile
    })
  } catch (error) {
    // Tambahkan logger
    logger.error(
      { profileId: req.params.id, error: error.message },
      'Failed to delete profile',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting profile',
      error: error.message,
    })
  }
}