import prisma from '../config/database.config.js'

export const getUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  
  res.status(200).json({
    "success": true,
    "message": "Users retrieved successfully",
    "data": users
  })
}

export const getUserId = async (req, res) => {
  const id = parseInt(req.params.id);

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
    res.status(404).send(`Users with id: ${id} not found`);
  }
  res.status(200).json({
    "success": true,
    "message": "User retrieved successfully",
    "data": user
  })
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password
    }
  })

  res.status(201).json({
    "success": true,
    "message": "Users created successfully",
    "data": user
  })
}

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
  const { name, email, password } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  })

  if (!user) {
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
  res.status(200).json({
    "success": true,
    "message": "Users updated successfully",
    "data": user
  })
}

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  })

  if (!user) {
    res.status(404).send(`User with ID: ${id} not found`)
    return
  }

  await prisma.users.delete({
    where: {
      id: id
    }
  })
  res.status(200).json({
    "success": true,
    "message": "User deleted successfully",
    "data": user
  })
}