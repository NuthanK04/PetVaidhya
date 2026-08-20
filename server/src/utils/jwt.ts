import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET ||
    "pet-vaidya-development-secret"
  );
};

const generateToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
  });
};

const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    getJwtSecret()
  ) as JwtPayload;
};

const jwtUtils = {
  generateToken,
  verifyToken,
};

export default jwtUtils;