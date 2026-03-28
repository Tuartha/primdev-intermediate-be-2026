import express from "express";

import { usersController } from "../controllers/index.controller.js";

const router = express.Router()

// BOOKS
router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUserId)
router.post('/', usersController.createUser)
router.put('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)

export default router