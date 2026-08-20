import { Router } from "express";
import {
  bookAppointment,
  getAppointments,
  getAppointment,
  changeAppointmentStatus,
} from "../controllers/appointment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", bookAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.patch("/:id/status", changeAppointmentStatus);

export default router;
