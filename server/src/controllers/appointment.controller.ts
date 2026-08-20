import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} from "../services/appointment.service";

export const bookAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const appointment = await createAppointment(ownerId, req.body);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully 🐾",
      data: appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to book appointment",
    });
  }
};

export const getAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role || "PET_OWNER";

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const appointments = await getUserAppointments(userId, role);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
    });
  }
};

export const getAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = String(req.params.id);
    const appointment = await getAppointmentById(userId, id);

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Appointment not found",
    });
  }
};

export const changeAppointmentStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = String(req.params.id);
    const { status } = req.body;

    const updated = await updateAppointmentStatus(userId, id, status);

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update appointment status",
    });
  }
};
