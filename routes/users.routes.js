import express from "express";

import { usersController } from "../controllers/index.controller.js";
import { userValidation, updateUserValidation } from "../validations/users.validation.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router()

// USERS
router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUserId)
router.post('/', authorizeAdmin, userValidation, usersController.createUser)
router.put('/:id', authorizeAdmin, updateUserValidation, usersController.updateUser)
router.delete('/:id', authorizeAdmin, usersController.deleteUser)

export default router