import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createMedicalRecord,
  getPetMedicalRecords,
  createVaccination,
  getPetVaccinations,
  getUserVaccinationReminders,
} from "../services/health-record.service";

export const addMedicalRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const petId = String(req.params.petId);
    const record = await createMedicalRecord(userId, {
      ...req.body,
      petId,
    });

    res.status(201).json({
      success: true,
      message: "Medical record added successfully",
      data: record,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add medical record",
    });
  }
};

export const getMedicalRecords = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const petId = String(req.params.petId);
    const records = await getPetMedicalRecords(petId);

    res.json({
      success: true,
      data: records,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medical records",
    });
  }
};

export const addVaccination = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const petId = String(req.params.petId);
    const vaccination = await createVaccination(userId, {
      ...req.body,
      petId,
    });

    res.status(201).json({
      success: true,
      message: "Vaccination recorded successfully",
      data: vaccination,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to record vaccination",
    });
  }
};

export const getVaccinations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const petId = String(req.params.petId);
    const vaccinations = await getPetVaccinations(petId);

    res.json({
      success: true,
      data: vaccinations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch vaccinations",
    });
  }
};

export const getReminders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const reminders = await getUserVaccinationReminders(userId);

    res.json({
      success: true,
      data: reminders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch vaccination reminders",
    });
  }
};
