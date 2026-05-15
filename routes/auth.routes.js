import express from "express";

import { authController } from "../controllers/index.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";

const router = express.Router()

router.post('/register', registerValidation, authController.register)
router.post('/login', loginValidation, authController.login)

export default router