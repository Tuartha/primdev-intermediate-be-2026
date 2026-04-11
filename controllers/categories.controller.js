import prisma from '../config/database.config.js'

export const getCategories = async (req, res) => {
  const categories = await prisma.categories.findMany()
  
  res.json({
    "success": true,
    "message": "Categories retrieved successfully",
    "data": categories
  })
}

export const getCategoryId = async (req, res) => {
  const id = parseInt(req.params.id);

  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  if (!category) {
    res.send(`Category with id: ${id} not found`);
  }
  res.json({
    "success": true,
    "message": "Category retrieved successfully",
    "data": category
  })
}

export const createCategory = async (req, res) => {
  const { name } = req.body;

  const category = await prisma.categories.create({
    data: {
      name
    }
  })

  res.json({
    "success": true,
    "message": "Category created successfully",
    "data": category
  })
}

export const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id);
  const { name } = req.body;
    
  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  if (!category) {
    res.send(`Category with ID: ${id} not found`)
    return
  }

  await prisma.categories.update({
    where: {
      id: id
    },
    data: {
      name
    }
  })
  res.json({
    "success": true,
    "message": "Category updated successfully",
    "data": category
  })
}

export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  if (!category) {
    res.send(`Category with ID: ${id} not found`)
    return
  }

  await prisma.categories.delete({
    where: {
      id: id
    }
  })
  res.json({
    "success": true,
    "message": "Category deleted successfully",
    "data": category
  })
}

export const isCategoryExist = async (id) => {
  // Mencari kategori dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  return !!category
}