import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // 7 days
const REFRESH_TOKEN_EXPIRES_IN = "30d"; // 30 days
// Live-server tokens must be short-lived: they grant access to the real-time
// GPS stream and leaderboard. A stolen 7-day access token would be far more
// damaging on the live surface than on normal REST endpoints.
const LIVE_TOKEN_EXPIRES_IN = "2h";

function getJWTSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET or NEXTAUTH_SECRET is not defined");
  }
  return JWT_SECRET;
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
    getJWTSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generateLiveToken(payload: Omit<JWTPayload, "type">) {
  return jwt.sign(
    {
      ...payload,
      type: "access",
    },
    getJWTSecret(),
    { expiresIn: LIVE_TOKEN_EXPIRES_IN }
  );
}

export function generateRefreshToken(payload: Omit<JWTPayload, "type">) {
  return jwt.sign(
    {
      ...payload,
      type: "refresh",
    },
    getJWTSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, getJWTSecret()) as JWTPayload;
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
