import prisma from "../config/prisma";

export interface CreatePetData {
  name: string;
  species: string;
  breed?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  dateOfBirth?: string;
  weightKg?: number;
  profileImage?: string;
}

export interface UpdatePetData {
  name?: string;
  species?: string;
  breed?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  dateOfBirth?: string;
  weightKg?: number;
  profileImage?: string;
}

export const createPet = async (
  ownerId: string,
  data: CreatePetData
) => {
  const pet = await prisma.pet.create({
    data: {
      ownerId,
      name: data.name,
      species: data.species,
      breed: data.breed || null,
      gender: data.gender || "UNKNOWN",
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : null,
      weightKg:
        data.weightKg !== undefined
          ? data.weightKg
          : null,
      profileImage: data.profileImage || null,
    },
  });

  return pet;
};

export const getAllPets = async (
  ownerId: string
) => {
  return prisma.pet.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPetById = async (
  ownerId: string,
  petId: string
) => {
  const pet = await prisma.pet.findFirst({
    where: {
      id: petId,
      ownerId,
    },
  });

  if (!pet) {
    throw new Error("Pet not found");
  }

  return pet;
};

export const updatePet = async (
  ownerId: string,
  petId: string,
  data: UpdatePetData
) => {
  const existingPet = await prisma.pet.findFirst({
    where: {
      id: petId,
      ownerId,
    },
  });

  if (!existingPet) {
    throw new Error("Pet not found");
  }

  const pet = await prisma.pet.update({
    where: {
      id: petId,
    },
    data: {
      name: data.name,
      species: data.species,
      breed:
        data.breed !== undefined
          ? data.breed
          : undefined,
      gender: data.gender,
      dateOfBirth:
        data.dateOfBirth !== undefined
          ? data.dateOfBirth
            ? new Date(data.dateOfBirth)
            : null
          : undefined,
      weightKg:
        data.weightKg !== undefined
          ? data.weightKg
          : undefined,
      profileImage:
        data.profileImage !== undefined
          ? data.profileImage
          : undefined,
    },
  });

  return pet;
};

export const deletePet = async (
  ownerId: string,
  petId: string
) => {
  const existingPet = await prisma.pet.findFirst({
    where: {
      id: petId,
      ownerId,
    },
  });

  if (!existingPet) {
    throw new Error("Pet not found");
  }

  await prisma.pet.delete({
    where: {
      id: petId,
    },
  });

  return {
    message: "Pet deleted successfully",
  };
};