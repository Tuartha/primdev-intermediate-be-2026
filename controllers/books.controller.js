import prisma from "../config/database.config.js"

export const getBooks = async (req, res) => {
    const books = await prisma.books.findMany()
  
    res.json({
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
    }
  })

  if (!book) {
    res.send(`Books with id: ${id} not found`);
  }
  res.json({
    "success": true,
    "message": "Book retrieved successfully",
    "data": book
  })
}

export const createBook = async (req, res) => {
    const { title, author, year } = req.body;
  // const newId = books.length + 1;
  // const newBook = { id: newId, title, author, year };

  // books.push(newBook);

  const book = await prisma.books.create({
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book created successfully",
    "data": book
  })
}

export const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
  const { title, author, year } = req.body;

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
    res.send(`Book with ID: ${id} not found`)
    return
  }

  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      title,
      author, 
      year
    }
  })
  res.json({
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
    res.send(`Book with ID: ${id} not found`)
    return
  }

  await prisma.books.delete({
    where: {
      id: id
    }
  })
  res.json({
    "success": true,
    "message": "Book deleted successfully"
  })
}