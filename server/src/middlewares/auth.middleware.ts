import type {
  Request,
  Response,
  NextFunction,
} from "express";
import jwtUtils from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
      return;
    }

    const payload = jwtUtils.verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};