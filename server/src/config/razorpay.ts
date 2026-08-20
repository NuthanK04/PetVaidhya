import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

if (!keyId || !keySecret) {
  console.warn("⚠️ Razorpay Key ID or Key Secret is missing from environment variables.");
}

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export const getRazorpayKeyId = (): string => {
  return process.env.RAZORPAY_KEY_ID || "";
};

export const getRazorpayKeySecret = (): string => {
  return process.env.RAZORPAY_KEY_SECRET || "";
};

export const getRazorpayWebhookSecret = (): string => {
  return process.env.RAZORPAY_WEBHOOK_SECRET || "petvaidya_webhook_secret_123";
};
