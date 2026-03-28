import prisma from '../config/database.config.js'

export const getUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  
  res.json({
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
    }
  })

  if (!user) {
    res.send(`Users with id: ${id} not found`);
  }
  res.json({
    "success": true,
    "message": "Book retrieved successfully",
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

  res.json({
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
    res.send(`User with ID: ${id} not found`)
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
  res.json({
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
    res.send(`User with ID: ${id} not found`)
    return
  }

  await prisma.users.delete({
    where: {
      id: id
    }
  })
  res.json({
    "success": true,
    "message": "Users deleted successfully",
    "data": user
  })
}