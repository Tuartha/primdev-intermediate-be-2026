import prisma from "../config/database.config.js"
import { isCategoryExist } from './categories.controller.js'

export const getBooks = async (req, res) => {
    const books = await prisma.books.findMany()
  
    res.status(200).json({
        "success": true,
        "message": "Books retrieved successfully",
        "data": books
    })
}

export const getBookById = async (req, res) => {
    const id = parseInt(req.params.id);

  const book = await prisma.books.findUnique({
    where: {
      id: id
    },
    include: {
      categories: {
        select: {
          name: true
        }
      }
    }
  })

  if (!book) {
    res.status(404).send(`Books with id: ${id} not found`);
  }
  res.status(200).json({
    "success": true,
    "message": "Book retrieved successfully",
    "data": book
  })
}

export const createBook = async (req, res) => {
    const { categoryId, title, author, year } = req.body;
  // const newId = books.length + 1;
  // const newBook = { id: newId, title, author, year };

  // books.push(newBook);

  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year
    }
  })

  res.status(201).json({
    "success": true,
    "message": "Book created successfully",
    "data": book
  })
}

export const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
  const { categoryId, title, author, year } = req.body;

  // const bookIndex = books.find((book) => book.id == id);
  // bookIndex.title = title;
  // bookIndex.author = author;
  // bookIndex.year = year;

  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  if (!book) {
    res.status(404).send(`Book with ID: ${id} not found`)
    return
  }

  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      categoryId,
      title,
      author, 
      year
    }
  })
  res.status(200).json({
    "success": true,
    "message": "Book updated successfully",
    "data": book
  })
}

export const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);

  // const bookIndex = books.find((book) => book.id === id);
  // books.splice(bookIndex, 1);

  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  if (!book) {
    res.status(200).send(`Book with ID: ${id} not found`)
    return
  }

  await prisma.books.delete({
    where: {
      id: id
    }
  })
  res.status(200).json({
    "success": true,
    "message": "Book deleted successfully"
  })
}