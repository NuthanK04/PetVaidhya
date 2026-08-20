import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import jwtUtils from "../utils/jwt";

interface RegisterData {
  name: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role?: "PET_OWNER" | "VETERINARIAN" | "SERVICE_PROVIDER";
}

interface LoginData {
  identifier: string;
  password: string;
}

// ============================================
// REGISTER WITH EMAIL / PHONE
// ============================================

export const registerUser = async (data: RegisterData) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    role = "PET_OWNER",
  } = data;

  const trimmedName = name ? name.trim() : "Pet Owner";
  const normalizedEmail = email && email.trim() !== "" ? email.trim().toLowerCase() : null;
  const normalizedPhone = phoneNumber && phoneNumber.trim() !== "" ? phoneNumber.trim() : null;

  if (!normalizedEmail && !normalizedPhone) {
    throw new Error("Email or mobile number is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check existing email case-insensitively
  if (normalizedEmail) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      throw new Error("Email is already registered");
    }
  }

  // Check existing phone
  if (normalizedPhone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phoneNumber: normalizedPhone,
      },
    });

    if (existingPhone) {
      throw new Error("Mobile number is already registered");
    }
  }

  // Hash password using bcrypt
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user with 100 welcome PV tokens
  const user = await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      passwordHash,
      role,
      tokenBalance: 100,
    },
  });

  // Log welcome tokens transaction
  await prisma.tokenTransaction.create({
    data: {
      userId: user.id,
      amount: 100,
      type: "BONUS",
      description: "Welcome signup bonus",
    },
  });

  // Generate Pet Vaidya JWT
  const token = jwtUtils.generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      tokenBalance: user.tokenBalance,
    },
    token,
  };
};

// ============================================
// LOGIN WITH EMAIL / PHONE
// ============================================

export const loginUser = async (data: LoginData) => {
  const {
    identifier,
    password,
  } = data;

  if (!identifier || !identifier.trim() || !password) {
    throw new Error(
      "Email/mobile number and password are required"
    );
  }

  const cleanIdentifier = identifier.trim();
  const cleanEmail = cleanIdentifier.toLowerCase();

  // Find user by normalized email (case-insensitive) OR phone number
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: cleanEmail,
            mode: "insensitive",
          },
        },
        {
          email: {
            equals: cleanIdentifier,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: cleanIdentifier,
        },
      ],
    },
  });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // Compare entered password with stored bcrypt hash
  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // Generate JWT token
  const token = jwtUtils.generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      tokenBalance: user.tokenBalance,
    },
    token,
  };
};

// ============================================
// GET CURRENT USER
// ============================================

export const getCurrentUser = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
      profileImage: true,
      isVerified: true,
      tokenBalance: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};