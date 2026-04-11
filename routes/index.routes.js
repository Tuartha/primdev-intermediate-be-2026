import express from "express";
import booksRoute from "./books.routes.js"
import usersRoute from "./users.routes.js"
import profilesRoute from "./profiles.routes.js"
import categoriesRoute from "./categories.routes.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("Welcome to API Library!");
});

router.use("/books", booksRoute)
router.use("/users", usersRoute)
router.use("/profiles", profilesRoute)
router.use("/categories", categoriesRoute)

export default router