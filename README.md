# 🐾 Pet Vaidya - Centralized Veterinary & Pet Healthcare Platform

Pet Vaidya is a centralized web platform designed to solve the fragmentation in pet healthcare by connecting pet owners with verified veterinarians, consultants, doorstep home veterinary services, and essential pet-care services through a simple and user-friendly interface.

---

## ✨ Features

- 🩺 **Find Veterinarians & Consultants**: Search doctors by city, clinic, specialization, or visit mode (In-Clinic, Home Visit, Online Video Consult, 24/7 Emergency).
- 🏡 **Doorstep Home Veterinary Care**: Schedule doorstep vet visits with address and time slot selection.
- 💳 **Razorpay Standard Checkout**: Secure, real-time payment gateway integration with INR-to-paise conversion, server-side fee validation, and cryptographic HMAC SHA-256 signature verification.
- 🐾 **Pet Management & Digital Health Passport**: Manage pet profiles, log vaccination history with due date tracking, and record diagnosis & medical prescriptions.
- 📊 **Unified Pet Owner Dashboard**: Overview of registered pets, upcoming appointments, vaccine due alerts, and PV loyalty wallet balance.
- ✂️ **Essential Pet-Care Services**: Book grooming, bathing, walking, pet sitting, boarding, and pet transport.
- 🪙 **PV Loyalty Rewards**: Earn bonus tokens on signup and bookings, redeemable for discounts.
- 🔒 **Secure JWT Authentication**: Native email/password authentication with bcrypt hashing and JWT token authorization.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Razorpay SDK, JWT, bcrypt
- **Database**: PostgreSQL
- **Payments**: Razorpay Payment Gateway (Test Mode / Production ready)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/NuthanK04/PetVaidhya.git
cd PetVaidhya
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your PostgreSQL database URL, JWT secret, and Razorpay keys

# Sync Prisma database schema
npx prisma db push

# Start backend dev server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start frontend dev server
npm run dev
```

The frontend will run at `http://localhost:5173` and backend at `http://localhost:4000`.

---

## 📄 License
MIT
