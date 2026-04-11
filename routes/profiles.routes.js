import express from "express";

import { profilesController } from "../controllers/index.controller.js";

const router = express.Router()

// PROFILES
router.get('/', profilesController.getProfiles)
router.get('/:id', profilesController.getProfileId)
router.post('/', profilesController.createProfile)
router.put('/:id', profilesController.updateProfile)
router.delete('/:id', profilesController.deleteProfile)

export default router