import prisma from "../config/prisma";
import type { AppointmentType, BookingStatus } from "@prisma/client";

export interface CreateAppointmentData {
  petId: string;
  veterinarianId: string;
  appointmentDate: string; // ISO date string or YYYY-MM-DD
  appointmentTime: string;
  type: AppointmentType;
  reason?: string;
  notes?: string;
  address?: string; // For home visits
  tokensUsed?: number;
}

export const createAppointment = async (
  ownerId: string,
  data: CreateAppointmentData
) => {
  // Check pet exists and belongs to owner
  const pet = await prisma.pet.findFirst({
    where: { id: data.petId, ownerId },
  });

  if (!pet) {
    throw new Error("Pet not found or does not belong to user");
  }

  // Get vet details to determine fees
  const vet = await prisma.veterinarian.findUnique({
    where: { id: data.veterinarianId },
  });

  if (!vet) {
    throw new Error("Veterinarian not found");
  }

  const consultationFee = Number(vet.consultationFee);
  let homeVisitFee = 0;
  let travelFee = 0;

  if (data.type === "HOME_VISIT") {
    homeVisitFee = 300; // Flat home visit convenience fee
  } else if (data.type === "EMERGENCY") {
    homeVisitFee = 500; // Emergency surcharge
  }

  let totalAmount = consultationFee + homeVisitFee + travelFee;

  // If tokens used, apply discount (10 tokens = 1 INR)
  if (data.tokensUsed && data.tokensUsed > 0) {
    const user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (user && user.tokenBalance >= data.tokensUsed) {
      const discount = Math.min(data.tokensUsed / 10, totalAmount * 0.2); // max 20% discount
      totalAmount = Math.max(0, totalAmount - discount);

      // Deduct tokens
      await prisma.user.update({
        where: { id: ownerId },
        data: { tokenBalance: { decrement: data.tokensUsed } },
      });

      await prisma.tokenTransaction.create({
        data: {
          userId: ownerId,
          amount: -data.tokensUsed,
          type: "USED",
          description: `Used for appointment booking`,
        },
      });
    }
  }

  // Combine notes with address if provided
  let fullNotes = data.notes || "";
  if (data.address) {
    fullNotes = fullNotes
      ? `Address: ${data.address}\nNotes: ${fullNotes}`
      : `Address: ${data.address}`;
  }

  const appointment = await prisma.appointment.create({
    data: {
      ownerId,
      petId: data.petId,
      veterinarianId: data.veterinarianId,
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      type: data.type,
      status: "CONFIRMED", // auto-confirm for seamless UX
      reason: data.reason || "General Consultation",
      notes: fullNotes || null,
      consultationFee,
      homeVisitFee,
      travelFee,
      totalAmount,
    },
    include: {
      pet: true,
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  // Award loyalty tokens for booking (e.g. 50 tokens)
  await prisma.user.update({
    where: { id: ownerId },
    data: { tokenBalance: { increment: 50 } },
  });

  await prisma.tokenTransaction.create({
    data: {
      userId: ownerId,
      amount: 50,
      type: "EARNED",
      description: "Earned for appointment booking",
    },
  });

  return appointment;
};

export const getUserAppointments = async (
  userId: string,
  role: string = "PET_OWNER"
) => {
  const whereClause: any = {};

  if (role === "VETERINARIAN") {
    const vet = await prisma.veterinarian.findUnique({
      where: { userId },
    });
    if (!vet) return [];
    whereClause.veterinarianId = vet.id;
  } else {
    whereClause.ownerId = userId;
  }

  return prisma.appointment.findMany({
    where: whereClause,
    include: {
      pet: true,
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
      medicalRecord: true,
    },
    orderBy: {
      appointmentDate: "desc",
    },
  });
};

export const getAppointmentById = async (
  userId: string,
  appointmentId: string
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      pet: true,
      veterinarian: {
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
      medicalRecord: true,
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.ownerId !== userId) {
    const vet = await prisma.veterinarian.findUnique({ where: { userId } });
    if (!vet || vet.id !== appointment.veterinarianId) {
      throw new Error("Unauthorized to access this appointment");
    }
  }

  return appointment;
};

export const updateAppointmentStatus = async (
  userId: string,
  appointmentId: string,
  status: BookingStatus
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      pet: true,
      veterinarian: {
        include: {
          user: true,
        },
      },
    },
  });
};
