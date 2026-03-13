import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import type { UserRole } from "@prisma/client";

export interface MobileAuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

/** Build token pair + user JSON response for a successful mobile auth */
export function buildAuthResponse(user: MobileAuthUser) {
  const token = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return NextResponse.json({
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
  });
}

export function bannedResponse() {
  return NextResponse.json({ error: "Account is banned" }, { status: 403 });
}
