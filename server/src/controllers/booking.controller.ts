import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
} from "../services/booking.service";

export const bookPetService = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const booking = await createBooking(ownerId, req.body);

    res.status(201).json({
      success: true,
      message: "Pet service booked successfully 🐾",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to book service",
    });
  }
};

export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const bookings = await getUserBookings(ownerId);

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

export const getBooking = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = String(req.params.id);
    const booking = await getBookingById(ownerId, id);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Booking not found",
    });
  }
};

export const changeBookingStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = String(req.params.id);
    const { status } = req.body;

    const updated = await updateBookingStatus(ownerId, id, status);

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking status",
    });
  }
};
