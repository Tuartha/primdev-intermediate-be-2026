import prisma from '../config/database.config.js'
import { checkValidations } from '../helpers/check-validations.js'

export const getCategories = async (req, res) => {
  const categories = await prisma.categories.findMany()
  
  res.status(200).json({
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
    res.status(404).send(`Category with id: ${id} not found`);
  }
  res.status(200).json({
    "success": true,
    "message": "Category retrieved successfully",
    "data": category
  })
}

export const createCategory = async (req, res, next) => {
  checkValidations(req, res, next);

  const { name } = req.body;

  const category = await prisma.categories.create({
    data: {
      name
    }
  })

  res.status(201).json({
    "success": true,
    "message": "Category created successfully",
    "data": category
  })
}

export const updateCategory = async (req, res, next) => {
  checkValidations(req, res, next);

  const id = parseInt(req.params.id);
  const { name } = req.body;
    
  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  if (!category) {
    res.status(404).send(`Category with ID: ${id} not found`)
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
  res.status(200).json({
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
    res.status(404).send(`Category with ID: ${id} not found`)
    return
  }

  await prisma.categories.delete({
    where: {
      id: id
    }
  })
  res.status(200).json({
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