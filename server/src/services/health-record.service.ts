import prisma from "../config/prisma";
import type { RecordType } from "@prisma/client";

export interface CreateMedicalRecordData {
  petId: string;
  veterinarianId?: string;
  appointmentId?: string;
  type?: RecordType;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  recordDate?: string;
}

export interface CreateVaccinationData {
  petId: string;
  veterinarianId?: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string;
  batchNumber?: string;
  notes?: string;
}

// ----------------- MEDICAL RECORDS -----------------

export const createMedicalRecord = async (
  userId: string,
  data: CreateMedicalRecordData
) => {
  // If no vet ID provided, find first available vet or use fallback
  let vetId = data.veterinarianId;
  if (!vetId) {
    const firstVet = await prisma.veterinarian.findFirst();
    if (firstVet) {
      vetId = firstVet.id;
    } else {
      throw new Error("Veterinarian record required");
    }
  }

  return prisma.medicalRecord.create({
    data: {
      petId: data.petId,
      veterinarianId: vetId,
      createdById: userId,
      appointmentId: data.appointmentId || null,
      type: data.type || "GENERAL",
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      prescription: data.prescription || null,
      notes: data.notes || null,
      recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
    },
    include: {
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getPetMedicalRecords = async (petId: string) => {
  return prisma.medicalRecord.findMany({
    where: { petId },
    include: {
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      recordDate: "desc",
    },
  });
};

// ----------------- VACCINATIONS -----------------

export const createVaccination = async (
  userId: string,
  data: CreateVaccinationData
) => {
  return prisma.vaccination.create({
    data: {
      petId: data.petId,
      veterinarianId: data.veterinarianId || null,
      createdById: userId,
      vaccineName: data.vaccineName,
      vaccinationDate: new Date(data.vaccinationDate),
      nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      batchNumber: data.batchNumber || null,
      notes: data.notes || null,
    },
    include: {
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getPetVaccinations = async (petId: string) => {
  return prisma.vaccination.findMany({
    where: { petId },
    include: {
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      vaccinationDate: "desc",
    },
  });
};

export const getUserVaccinationReminders = async (ownerId: string) => {
  const userPets = await prisma.pet.findMany({
    where: { ownerId },
    select: { id: true, name: true, species: true },
  });

  const petIds = userPets.map((p) => p.id);

  const upcomingVaccinations = await prisma.vaccination.findMany({
    where: {
      petId: { in: petIds },
      nextDueDate: {
        not: null,
      },
    },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          species: true,
        },
      },
    },
    orderBy: {
      nextDueDate: "asc",
    },
  });

  return upcomingVaccinations;
};
