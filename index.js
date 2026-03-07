import express from "express";
import { books } from "./data.js";

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to API Library!");
});

app.get("/books", (req, res) => {
  // res.send("List of books will be here")
  res.send(books);
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const book = books.find((book) => book.id === id);

  if (!book) {
    res.send(`Books with id: ${id} not found`);
  }
  res.send(book);
});

app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  const newId = books.length + 1;
  const newBook = { id: newId, title, author, year };

  books.push(newBook);

  res.send("Book created successsfully");
});

app.put("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;

  const bookIndex = books.find((book) => book.id == id);
  bookIndex.title = title;
  bookIndex.author = author;
  bookIndex.year = year;
  res.send(`Books with id: ${id} updated successfully`);
});

app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const bookIndex = books.find((book) => book.id === id);
  books.splice(bookIndex, 1);
  res.send(`Book with id: ${id} deleted successfully`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
