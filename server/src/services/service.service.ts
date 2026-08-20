import prisma from "../config/prisma";
import type { ServiceCategory, PricingType } from "@prisma/client";

export interface ServiceFilterOptions {
  category?: ServiceCategory;
  search?: string;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  category: ServiceCategory;
  pricingType?: PricingType;
  basePrice: number;
  providerId?: string;
}

export const getAllServices = async (filters: ServiceFilterOptions = {}) => {
  const whereClause: any = { isActive: true };

  if (filters.category) {
    whereClause.category = filters.category;
  }

  if (filters.search) {
    whereClause.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.service.findMany({
    where: whereClause,
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          verified: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      provider: true,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

export const createService = async (data: CreateServiceData) => {
  return prisma.service.create({
    data: {
      name: data.name,
      description: data.description || null,
      category: data.category,
      pricingType: data.pricingType || "FIXED",
      basePrice: data.basePrice,
      providerId: data.providerId || null,
      isActive: true,
    },
  });
};
