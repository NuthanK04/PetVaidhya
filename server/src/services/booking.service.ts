import prisma from "../config/prisma";
import type { BookingStatus } from "@prisma/client";

export interface CreateBookingData {
  petId: string;
  serviceId?: string;
  serviceProviderId?: string;
  scheduledStart: string; // ISO date string
  scheduledEnd?: string;
  quantity?: number;
  address?: string;
  notes?: string;
  tokensUsed?: number;
}

export const createBooking = async (
  ownerId: string,
  data: CreateBookingData
) => {
  const pet = await prisma.pet.findFirst({
    where: { id: data.petId, ownerId },
  });

  if (!pet) {
    throw new Error("Pet not found or does not belong to user");
  }

  let baseAmount = 500;
  let serviceName = "Pet Care Service";

  if (data.serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (service) {
      baseAmount = Number(service.basePrice);
      serviceName = service.name;
    }
  }

  const quantity = data.quantity || 1;
  const subtotalAmount = baseAmount * quantity;
  const platformFee = 25;
  const taxAmount = Number((subtotalAmount * 0.05).toFixed(2)); // 5% GST
  let tokenDiscount = 0;

  if (data.tokensUsed && data.tokensUsed > 0) {
    const user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (user && user.tokenBalance >= data.tokensUsed) {
      tokenDiscount = Math.min(data.tokensUsed / 10, subtotalAmount * 0.2);

      await prisma.user.update({
        where: { id: ownerId },
        data: { tokenBalance: { decrement: data.tokensUsed } },
      });

      await prisma.tokenTransaction.create({
        data: {
          userId: ownerId,
          amount: -data.tokensUsed,
          type: "USED",
          description: `Used for ${serviceName} booking`,
        },
      });
    }
  }

  const totalAmount = Math.max(
    0,
    subtotalAmount + platformFee + taxAmount - tokenDiscount
  );

  const bookingNumber = `PV-${Date.now().toString().slice(-6)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      ownerId,
      petId: data.petId,
      serviceId: data.serviceId || null,
      serviceProviderId: data.serviceProviderId || null,
      status: "CONFIRMED",
      scheduledStart: new Date(data.scheduledStart),
      scheduledEnd: data.scheduledEnd ? new Date(data.scheduledEnd) : null,
      quantity,
      baseAmount,
      additionalCharges: 0,
      subtotalAmount,
      discountAmount: 0,
      tokenDiscount,
      platformFee,
      taxAmount,
      totalAmount,
      address: data.address || null,
      notes: data.notes || null,
    },
    include: {
      pet: true,
      service: true,
      serviceProvider: true,
    },
  });

  // Award PV Tokens for booking
  await prisma.user.update({
    where: { id: ownerId },
    data: { tokenBalance: { increment: 40 } },
  });

  await prisma.tokenTransaction.create({
    data: {
      userId: ownerId,
      amount: 40,
      type: "EARNED",
      description: `Earned for booking ${serviceName}`,
    },
  });

  return booking;
};

export const getUserBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: { ownerId: userId },
    include: {
      pet: true,
      service: true,
      serviceProvider: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBookingById = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      pet: true,
      service: true,
      serviceProvider: true,
      review: true,
    },
  });

  if (!booking || booking.ownerId !== userId) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const updateBookingStatus = async (
  userId: string,
  bookingId: string,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.ownerId !== userId) {
    throw new Error("Booking not found");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      pet: true,
      service: true,
    },
  });
};
