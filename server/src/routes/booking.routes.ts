import { Router } from "express";
import {
  bookPetService,
  getBookings,
  getBooking,
  changeBookingStatus,
} from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", bookPetService);
router.get("/", getBookings);
router.get("/:id", getBooking);
router.patch("/:id/status", changeBookingStatus);

export default router;
