import { Router } from "express";
import {
  getServices,
  getService,
  addService,
} from "../controllers/service.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getServices);
router.get("/:id", getService);
router.post("/", authenticate, addService);

export default router;
