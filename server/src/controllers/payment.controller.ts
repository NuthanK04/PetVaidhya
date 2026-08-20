import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createPaymentOrder,
  verifyPaymentSignature,
  handleRazorpayWebhook,
} from "../services/payment.service";

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const {
      type,
      petId,
      veterinarianId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      reason,
      serviceId,
      scheduledStart,
      quantity,
      address,
      notes,
      tokensUsed,
    } = req.body;

    if (!type || !petId) {
      res.status(400).json({
        success: false,
        message: "Payment type and petId are required",
      });
      return;
    }

    const result = await createPaymentOrder({
      userId: req.user.userId,
      type,
      petId,
      veterinarianId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      reason,
      serviceId,
      scheduledStart,
      quantity,
      address,
      notes,
      tokensUsed,
    });

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Create payment order error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

export const verify = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: "Missing Razorpay verification parameters",
      });
      return;
    }

    const result = await verifyPaymentSignature({
      userId: req.user.userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Payment signature verification failed",
    });
  }
};

export const webhook = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      res.status(400).json({
        success: false,
        message: "Webhook signature header missing",
      });
      return;
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const result = await handleRazorpayWebhook(rawBody, signature);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};
