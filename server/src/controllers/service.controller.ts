import type { Request, Response } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
} from "../services/service.service";

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const services = await getAllServices({
      category: category as any,
      search: search ? String(search) : undefined,
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch services",
    });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = await getServiceById(id);

    res.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Service not found",
    });
  }
};

export const addService = async (req: Request, res: Response) => {
  try {
    const service = await createService(req.body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create service",
    });
  }
};
