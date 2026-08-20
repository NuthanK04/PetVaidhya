import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  getAllVeterinarians,
  getVeterinarianById,
  createOrUpdateVetProfile,
} from "../services/veterinarian.service";

export const getVeterinarians = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      search,
      city,
      specialization,
      homeVisitAvailable,
      onlineAvailable,
      emergencyAvailable,
      maxFee,
    } = req.query;

    const vets = await getAllVeterinarians({
      search: search ? String(search) : undefined,
      city: city ? String(city) : undefined,
      specialization: specialization ? String(specialization) : undefined,
      homeVisitAvailable:
        homeVisitAvailable !== undefined
          ? homeVisitAvailable === "true"
          : undefined,
      onlineAvailable:
        onlineAvailable !== undefined
          ? onlineAvailable === "true"
          : undefined,
      emergencyAvailable:
        emergencyAvailable !== undefined
          ? emergencyAvailable === "true"
          : undefined,
      maxFee: maxFee ? Number(maxFee) : undefined,
    });

    res.json({
      success: true,
      data: vets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch veterinarians",
    });
  }
};

export const getVeterinarian = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const vet = await getVeterinarianById(id);

    res.json({
      success: true,
      data: vet,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Veterinarian not found",
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const vet = await createOrUpdateVetProfile(userId, req.body);

    res.json({
      success: true,
      message: "Veterinarian profile updated successfully",
      data: vet,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
