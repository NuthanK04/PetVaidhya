import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import petRoutes from "./routes/pet.routes";
import veterinarianRoutes from "./routes/veterinarian.routes";
import appointmentRoutes from "./routes/appointment.routes";
import serviceRoutes from "./routes/service.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";
import { seedInitialData } from "./utils/seed-data";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());

// Capture raw body buffer for Razorpay webhook HMAC SHA-256 verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Pet Vaidya API is running 🐾 - Centralized Pet Healthcare Platform",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "Pet Vaidya API",
    status: "healthy",
  });
});

app.listen(PORT, async () => {
  console.log(`🐾 Pet Vaidya API running on http://localhost:${PORT}`);
  await seedInitialData();
});