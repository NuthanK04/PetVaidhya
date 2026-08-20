-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PET_OWNER', 'VETERINARIAN', 'SERVICE_PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CLINIC_VISIT', 'HOME_VISIT', 'ONLINE_CONSULTATION', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('VETERINARY', 'GROOMING', 'BATHING', 'PET_WALKING', 'PET_SITTING', 'BOARDING', 'PET_TRANSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FIXED', 'PER_HOUR', 'PER_DAY', 'PER_SESSION', 'PER_KM');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "CouponScope" AS ENUM ('ALL', 'VETERINARY', 'GROOMING', 'BATHING', 'PET_WALKING', 'PET_SITTING', 'BOARDING', 'PET_TRANSPORT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('RAZORPAY', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('EARNED', 'USED', 'REFUND', 'BONUS', 'EXPIRED', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('DIAGNOSIS', 'TREATMENT', 'PRESCRIPTION', 'GENERAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PET_OWNER',
    "profileImage" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "dateOfBirth" TIMESTAMP(3),
    "weightKg" DOUBLE PRECISION,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veterinarian" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicName" TEXT,
    "specialization" TEXT,
    "qualification" TEXT,
    "experienceYears" INTEGER,
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "bio" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "homeVisitAvailable" BOOLEAN NOT NULL DEFAULT false,
    "onlineAvailable" BOOLEAN NOT NULL DEFAULT false,
    "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veterinarian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "providerId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ServiceCategory" NOT NULL,
    "pricingType" "PricingType" NOT NULL DEFAULT 'FIXED',
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "veterinarianId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "notes" TEXT,
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "homeVisitFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "travelFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceId" TEXT,
    "veterinarianId" TEXT,
    "serviceProviderId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "baseAmount" DECIMAL(10,2) NOT NULL,
    "additionalCharges" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "subtotalAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tokenDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minimumOrderAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "maximumDiscount" DECIMAL(10,2),
    "scope" "CouponScope" NOT NULL DEFAULT 'ALL',
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponUsage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "amount" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tokenDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "veterinarianId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "appointmentId" TEXT,
    "type" "RecordType" NOT NULL DEFAULT 'GENERAL',
    "diagnosis" TEXT,
    "treatment" TEXT,
    "prescription" TEXT,
    "notes" TEXT,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "veterinarianId" TEXT,
    "createdById" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "vaccinationDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "batchNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "veterinarianId" TEXT,
    "serviceProviderId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "Pet_ownerId_idx" ON "Pet"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinarian_userId_key" ON "Veterinarian"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_userId_key" ON "ServiceProvider"("userId");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_providerId_idx" ON "Service"("providerId");

-- CreateIndex
CREATE INDEX "Appointment_petId_idx" ON "Appointment"("petId");

-- CreateIndex
CREATE INDEX "Appointment_ownerId_idx" ON "Appointment"("ownerId");

-- CreateIndex
CREATE INDEX "Appointment_veterinarianId_idx" ON "Appointment"("veterinarianId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

-- CreateIndex
CREATE INDEX "Booking_ownerId_idx" ON "Booking"("ownerId");

-- CreateIndex
CREATE INDEX "Booking_petId_idx" ON "Booking"("petId");

-- CreateIndex
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");

-- CreateIndex
CREATE INDEX "Booking_veterinarianId_idx" ON "Booking"("veterinarianId");

-- CreateIndex
CREATE INDEX "Booking_serviceProviderId_idx" ON "Booking"("serviceProviderId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CouponUsage_bookingId_key" ON "CouponUsage"("bookingId");

-- CreateIndex
CREATE INDEX "CouponUsage_couponId_idx" ON "CouponUsage"("couponId");

-- CreateIndex
CREATE INDEX "CouponUsage_userId_idx" ON "CouponUsage"("userId");

-- CreateIndex
CREATE INDEX "TokenTransaction_userId_idx" ON "TokenTransaction"("userId");

-- CreateIndex
CREATE INDEX "TokenTransaction_bookingId_idx" ON "TokenTransaction"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_bookingId_key" ON "Invoice"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentId_key" ON "Invoice"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_appointmentId_key" ON "MedicalRecord"("appointmentId");

-- CreateIndex
CREATE INDEX "MedicalRecord_petId_idx" ON "MedicalRecord"("petId");

-- CreateIndex
CREATE INDEX "MedicalRecord_veterinarianId_idx" ON "MedicalRecord"("veterinarianId");

-- CreateIndex
CREATE INDEX "Vaccination_petId_idx" ON "Vaccination"("petId");

-- CreateIndex
CREATE INDEX "Vaccination_nextDueDate_idx" ON "Vaccination"("nextDueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_veterinarianId_idx" ON "Review"("veterinarianId");

-- CreateIndex
CREATE INDEX "Review_serviceProviderId_idx" ON "Review"("serviceProviderId");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veterinarian" ADD CONSTRAINT "Veterinarian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
