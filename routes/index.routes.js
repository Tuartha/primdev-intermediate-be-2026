import express from "express";
import booksRoute from "./books.routes.js"
import usersRoute from "./users.routes.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("Welcome to API Library!");
});

router.use("/books", booksRoute)
router.use("/users", usersRoute)

export default router