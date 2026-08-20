import crypto from "crypto";
import prisma from "../config/prisma";
import {
  razorpayInstance,
  getRazorpayKeyId,
  getRazorpayKeySecret,
  getRazorpayWebhookSecret,
} from "../config/razorpay";

export interface CreateOrderInput {
  userId: string;
  type: "APPOINTMENT" | "SERVICE_BOOKING";

  // Appointment fields
  petId: string;
  veterinarianId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY";
  reason?: string;

  // Service fields
  serviceId?: string;
  scheduledStart?: string;
  quantity?: number;

  // Common fields
  address?: string;
  notes?: string;
  tokensUsed?: number;
}

export interface VerifyPaymentInput {
  userId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ============================================
// 1. CREATE PAYMENT ORDER (SERVER VALIDATION)
// ============================================

export const createPaymentOrder = async (input: CreateOrderInput) => {
  const {
    userId,
    type,
    petId,
    veterinarianId,
    appointmentDate,
    appointmentTime,
    appointmentType = "CLINIC_VISIT",
    reason,
    serviceId,
    scheduledStart,
    quantity = 1,
    address,
    notes,
    tokensUsed = 0,
  } = input;

  // Verify pet exists
  const pet = await prisma.pet.findFirst({
    where: { id: petId, ownerId: userId },
  });

  if (!pet) {
    throw new Error("Selected pet profile not found");
  }

  // Get user to check loyalty tokens
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User account not found");
  }

  let totalAmount = 0;
  let appointmentRecord: any = null;
  let bookingRecord: any = null;

  // ----------------------------------------
  // A. VETERINARIAN APPOINTMENT
  // ----------------------------------------
  if (type === "APPOINTMENT") {
    let consultationFee = 500;

    if (veterinarianId && veterinarianId !== "default-vet") {
      const vet = await prisma.veterinarian.findUnique({
        where: { id: veterinarianId },
      });
      if (vet) {
        consultationFee = Number(vet.consultationFee);
      }
    }

    const homeVisitFee =
      appointmentType === "HOME_VISIT"
        ? 300
        : appointmentType === "EMERGENCY"
        ? 500
        : 0;

    const platformFee = 25;
    const subtotal = consultationFee + homeVisitFee;

    // Validate tokens
    let tokenDiscount = 0;
    if (tokensUsed > 0 && user.tokenBalance >= 500) {
      tokenDiscount = Math.min(50, Math.floor(subtotal * 0.15));
    }

    totalAmount = Math.max(1, subtotal + platformFee - tokenDiscount);

    // Parse appointment date
    const appDate = appointmentDate ? new Date(appointmentDate) : new Date();

    // Create Appointment in PENDING state
    // If vet id not found in DB, link to first available vet
    let finalVetId = veterinarianId;
    if (!finalVetId || finalVetId === "default-vet") {
      const firstVet = await prisma.veterinarian.findFirst();
      if (firstVet) {
        finalVetId = firstVet.id;
      }
    }

    if (!finalVetId) {
      throw new Error("No veterinarian available for booking");
    }

    appointmentRecord = await prisma.appointment.create({
      data: {
        petId,
        ownerId: userId,
        veterinarianId: finalVetId,
        appointmentDate: appDate,
        appointmentTime: appointmentTime || "10:00 AM",
        type: appointmentType,
        status: "PENDING",
        reason: reason || "Consultation",
        notes: address ? `${notes || ""} | Address: ${address}` : notes,
        consultationFee,
        homeVisitFee,
        travelFee: 0,
        totalAmount,
      },
    });
  }

  // ----------------------------------------
  // B. PET CARE SERVICE BOOKING
  // ----------------------------------------
  else if (type === "SERVICE_BOOKING") {
    let basePrice = 499;
    let finalServiceId = serviceId;

    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (service) {
        basePrice = Number(service.basePrice);
        finalServiceId = service.id;
      }
    }

    const platformFee = 25;
    const subtotal = basePrice * Math.max(1, quantity);

    let tokenDiscount = 0;
    if (tokensUsed > 0 && user.tokenBalance >= 500) {
      tokenDiscount = Math.min(50, Math.floor(subtotal * 0.15));
    }

    totalAmount = Math.max(1, subtotal + platformFee - tokenDiscount);

    const bookingNumber = `PV-${Date.now().toString().slice(-6)}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    bookingRecord = await prisma.booking.create({
      data: {
        bookingNumber,
        ownerId: userId,
        petId,
        serviceId: finalServiceId || null,
        status: "PENDING",
        scheduledStart: scheduledStart ? new Date(scheduledStart) : new Date(),
        quantity: Math.max(1, quantity),
        baseAmount: basePrice,
        subtotalAmount: subtotal,
        platformFee,
        tokenDiscount,
        totalAmount,
        address: address || "Doorstep Care",
        notes,
      },
    });
  }

  // ----------------------------------------
  // C. CREATE RAZORPAY ORDER (IN PAISE)
  // ----------------------------------------
  const amountInPaise = Math.round(totalAmount * 100);
  const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes: {
      userId,
      type,
      petId,
      appointmentId: appointmentRecord?.id || "",
      bookingId: bookingRecord?.id || "",
    },
  });

  // ----------------------------------------
  // D. STORE PAYMENT RECORD IN POSTGRESQL
  // ----------------------------------------
  const payment = await prisma.payment.create({
    data: {
      userId,
      appointmentId: appointmentRecord?.id || null,
      bookingId: bookingRecord?.id || null,
      amount: totalAmount,
      currency: "INR",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
      status: "CREATED",
    },
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount, // in paise
    amountInRupees: totalAmount,
    currency: "INR",
    keyId: getRazorpayKeyId(),
    paymentId: payment.id,
    appointmentId: appointmentRecord?.id || null,
    bookingId: bookingRecord?.id || null,
  };
};

// ============================================
// 2. VERIFY PAYMENT SIGNATURE (HMAC SHA-256)
// ============================================

export const verifyPaymentSignature = async (input: VerifyPaymentInput) => {
  const {
    userId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = input;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing required Razorpay payment verification parameters");
  }

  // 1. Cryptographic HMAC SHA-256 signature verification
  const keySecret = getRazorpayKeySecret();
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    // Record failure in DB
    await prisma.payment.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: { status: "FAILED" },
    });
    throw new Error("Cryptographic payment signature verification failed");
  }

  // 2. Find payment record by Razorpay order ID
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    include: {
      appointment: true,
      booking: true,
    },
  });

  if (!payment) {
    throw new Error("Payment record not found for the given order ID");
  }

  if (payment.userId !== userId) {
    throw new Error("Unauthorized: Payment does not belong to logged-in user");
  }

  // Idempotent: If already marked SUCCESS, return confirmation
  if (payment.status === "SUCCESS") {
    return {
      success: true,
      message: "Payment already verified",
      paymentId: payment.id,
      appointmentId: payment.appointmentId,
      bookingId: payment.bookingId,
    };
  }

  // 3. Update Payment record to SUCCESS
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "SUCCESS",
      paidAt: new Date(),
    },
  });

  // 4. Confirm Appointment / Booking
  if (payment.appointmentId) {
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { status: "CONFIRMED" },
    });
  }

  if (payment.bookingId) {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    });
  }

  // 5. Award +50 PV Loyalty Reward Tokens
  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenBalance: {
        increment: 50,
      },
    },
  });

  await prisma.tokenTransaction.create({
    data: {
      userId,
      amount: 50,
      type: "EARNED",
      description: `Payment reward for Order #${razorpay_order_id.slice(-6)}`,
    },
  });

  return {
    success: true,
    message: "Payment successfully verified and booking confirmed",
    paymentId: updatedPayment.id,
    razorpayPaymentId: razorpay_payment_id,
    appointmentId: payment.appointmentId,
    bookingId: payment.bookingId,
  };
};

// ============================================
// 3. RAZORPAY WEBHOOK HANDLER (IDEMPOTENT)
// ============================================

export const handleRazorpayWebhook = async (
  rawBody: string | Buffer,
  signature: string
) => {
  const webhookSecret = getRazorpayWebhookSecret();

  // Validate webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid Razorpay webhook signature");
  }

  const event =
    typeof rawBody === "string" ? JSON.parse(rawBody) : JSON.parse(rawBody.toString("utf8"));

  const eventType = event.event;
  const paymentEntity = event.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;
  const paymentId = paymentEntity?.id;

  if (!orderId) {
    return { received: true, message: "No order ID in webhook payload" };
  }

  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!payment) {
    return { received: true, message: "Payment order not found" };
  }

  // Handle captured / successful payment
  if (
    (eventType === "payment.captured" || eventType === "order.paid") &&
    payment.status !== "SUCCESS"
  ) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: paymentId || payment.razorpayPaymentId,
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });

    if (payment.appointmentId) {
      await prisma.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: "CONFIRMED" },
      });
    }

    if (payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });
    }

    // Award +50 PV Tokens
    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        tokenBalance: {
          increment: 50,
        },
      },
    });
  }

  // Handle failed payment
  else if (eventType === "payment.failed" && payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: paymentId || payment.razorpayPaymentId,
        status: "FAILED",
      },
    });
  }

  return { received: true, event: eventType };
};
