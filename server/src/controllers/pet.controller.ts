import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from "../services/pet.service";

export const create = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const {
      name,
      species,
      breed,
      gender,
      dateOfBirth,
      weightKg,
      profileImage,
    } = req.body;

    if (!name || !species) {
      res.status(400).json({
        success: false,
        message: "Pet name and species are required",
      });
      return;
    }

    const pet = await createPet(req.user.userId, {
      name,
      species,
      breed,
      gender,
      dateOfBirth,
      weightKg,
      profileImage,
    });

    res.status(201).json({
      success: true,
      message: "Pet created successfully",
      data: pet,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create pet";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const pets = await getAllPets(req.user.userId);

    res.status(200).json({
      success: true,
      data: pets,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch pets";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getOne = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const petId = req.params.id;

    if (typeof petId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid pet ID",
      });
      return;
    }

    const pet = await getPetById(
      req.user.userId,
      petId
    );

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Pet not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const petId = req.params.id;

    if (typeof petId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid pet ID",
      });
      return;
    }

    const pet = await updatePet(
      req.user.userId,
      petId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: pet,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update pet";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const remove = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const petId = req.params.id;

    if (typeof petId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid pet ID",
      });
      return;
    }

    const result = await deletePet(
      req.user.userId,
      petId
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete pet";

    res.status(404).json({
      success: false,
      message,
    });
  }
};