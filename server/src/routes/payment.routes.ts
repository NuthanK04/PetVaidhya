import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createOrder,
  verify,
  webhook,
} from "../controllers/payment.controller";

const router = Router();

// Create Razorpay Order (Protected)
router.post("/create-order", authenticate, createOrder);

// Verify Razorpay Payment Signature (Protected)
router.post("/verify", authenticate, verify);

// Razorpay Webhook Endpoint (Public with signature check)
router.post("/webhook", webhook);

export default router;
