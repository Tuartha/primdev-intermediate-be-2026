import prisma from '../config/database.config.js'

export const getProfiles = async (req, res) => {
  const profiles = await prisma.profiles.findMany()
  
  res.json({
    "success": true,
    "message": "Profiles retrieved successfully",
    "data": profiles
  })
}

export const getProfileId = async (req, res) => {
  const id = parseInt(req.params.id);

  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  if (!profile) {
    res.send(`Profile with id: ${id} not found`);
  }
  res.json({
    "success": true,
    "message": "Profile retrieved successfully",
    "data": profile
  })
}

export const createProfile = async (req, res) => {
  const { userId, address, phone } = req.body;

  const profile = await prisma.profiles.create({
    data: {
      userId,
      address,
      phone
    }
  })

  res.json({
    "success": true,
    "message": "Profile created successfully",
    "data": profile
  })
}

export const updateProfile = async (req, res) => {
    const id = parseInt(req.params.id);
  const { userId, address, phone } = req.body;

  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  if (!profile) {
    res.send(`Profile with ID: ${id} not found`)
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
  res.json({
    "success": true,
    "message": "Profile updated successfully",
    "data": profile
  })
}

export const deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id);

  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  if (!profile) {
    res.send(`Profile with ID: ${id} not found`)
    return
  }

  await prisma.profiles.delete({
    where: {
      id: id
    }
  })
  res.json({
    "success": true,
    "message": "Profile deleted successfully",
    "data": profile
  })
}