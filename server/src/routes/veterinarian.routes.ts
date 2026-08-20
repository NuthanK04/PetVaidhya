import { Router } from "express";
import {
  getVeterinarians,
  getVeterinarian,
  updateProfile,
} from "../controllers/veterinarian.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Publicly searchable
router.get("/", getVeterinarians);
router.get("/:id", getVeterinarian);

// Authenticated vet profile update
router.put("/profile", authenticate, updateProfile);

export default router;
