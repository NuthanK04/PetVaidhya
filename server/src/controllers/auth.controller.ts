import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role,
    } = req.body;

    if (!name || !password) {
      res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
      return;
    }

    if (!email && !phoneNumber) {
      res.status(400).json({
        success: false,
        message: "Email or mobile number is required",
      });
      return;
    }

    const result = await registerUser({
      name,
      email,
      phoneNumber,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Registration failed";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      identifier,
      password,
    } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message:
          "Email/mobile number and password are required",
      });
      return;
    }

    const result = await loginUser({
      identifier,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Login failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const user = await getCurrentUser(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch user";

    res.status(404).json({
      success: false,
      message,
    });
  }
};