import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = "7d"; // 7 days
const REFRESH_TOKEN_EXPIRES_IN = "30d"; // 30 days

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET or NEXTAUTH_SECRET is not defined");
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type?: "access" | "refresh";
}

export function generateAccessToken(payload: Omit<JWTPayload, "type">) {
  return jwt.sign(
    {
      ...payload,
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generateRefreshToken(payload: Omit<JWTPayload, "type">) {
  return jwt.sign(
    {
      ...payload,
      type: "refresh",
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
