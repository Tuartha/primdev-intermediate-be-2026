import express from "express";
// import { books } from "./data.js";
import prisma from './database.js'

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to API Library!");
});

// BOOKS
app.get("/books", async (req, res) => {
  // res.send("List of books will be here")
  const books = await prisma.books.findMany()
  
  res.json({
    "success": true,
    "message": "Books retrieved successfully",
    "data": books
  })
});

app.get("/books/:id", async (req, res) => {
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
});

app.post("/books", async (req, res) => {
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
});

app.put("/books/:id", async (req, res) => {
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
});

app.delete("/books/:id", async (req, res) => {
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
});

// USER
app.get("/users", async (req, res) => {
  // res.send("List of books will be here")
  const users = await prisma.users.findMany()
  
  res.json({
    "success": true,
    "message": "Users retrieved successfully",
    "data": users
  })
});

app.get("/users/:id", async (req, res) => {
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
});

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  // const newId = books.length + 1;
  // const newBook = { id: newId, title, author, year };

  // books.push(newBook);

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
});

app.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password } = req.body;

  // const bookIndex = books.find((book) => book.id == id);
  // bookIndex.title = title;
  // bookIndex.author = author;
  // bookIndex.year = year;

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
});

app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // const bookIndex = books.find((book) => book.id === id);
  // books.splice(bookIndex, 1);

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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
