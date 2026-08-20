import prisma from "../config/prisma";

export interface VetFilterOptions {
  search?: string;
  city?: string;
  specialization?: string;
  homeVisitAvailable?: boolean;
  onlineAvailable?: boolean;
  emergencyAvailable?: boolean;
  maxFee?: number;
}

export interface CreateVetData {
  clinicName?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: number;
  consultationFee: number;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  homeVisitAvailable?: boolean;
  onlineAvailable?: boolean;
  emergencyAvailable?: boolean;
}

export const getAllVeterinarians = async (filters: VetFilterOptions = {}) => {
  const {
    search,
    city,
    specialization,
    homeVisitAvailable,
    onlineAvailable,
    emergencyAvailable,
    maxFee,
  } = filters;

  const whereClause: any = {};

  if (city) {
    whereClause.city = { contains: city, mode: "insensitive" };
  }

  if (specialization) {
    whereClause.specialization = { contains: specialization, mode: "insensitive" };
  }

  if (homeVisitAvailable !== undefined) {
    whereClause.homeVisitAvailable = homeVisitAvailable;
  }

  if (onlineAvailable !== undefined) {
    whereClause.onlineAvailable = onlineAvailable;
  }

  if (emergencyAvailable !== undefined) {
    whereClause.emergencyAvailable = emergencyAvailable;
  }

  if (maxFee !== undefined && !isNaN(maxFee)) {
    whereClause.consultationFee = { lte: maxFee };
  }

  if (search) {
    whereClause.OR = [
      { clinicName: { contains: search, mode: "insensitive" } },
      { specialization: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const vets = await prisma.veterinarian.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      verified: "desc",
    },
  });

  return vets.map((vet) => {
    const totalRating = vet.reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = vet.reviews.length > 0 ? totalRating / vet.reviews.length : 4.8; // default positive starting rating if new
    return {
      ...vet,
      rating: Number(averageRating.toFixed(1)),
      reviewCount: vet.reviews.length,
    };
  });
};

export const getVeterinarianById = async (id: string) => {
  const vet = await prisma.veterinarian.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!vet) {
    throw new Error("Veterinarian not found");
  }

  const totalRating = vet.reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = vet.reviews.length > 0 ? totalRating / vet.reviews.length : 4.8;

  return {
    ...vet,
    rating: Number(averageRating.toFixed(1)),
    reviewCount: vet.reviews.length,
  };
};

export const createOrUpdateVetProfile = async (
  userId: string,
  data: CreateVetData
) => {
  const existing = await prisma.veterinarian.findUnique({
    where: { userId },
  });

  if (existing) {
    return prisma.veterinarian.update({
      where: { userId },
      data: {
        ...data,
        consultationFee: data.consultationFee,
      },
      include: {
        user: true,
      },
    });
  }

  return prisma.veterinarian.create({
    data: {
      userId,
      ...data,
      consultationFee: data.consultationFee,
      verified: true,
    },
    include: {
      user: true,
    },
  });
};
