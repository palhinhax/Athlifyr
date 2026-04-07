import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { generateLiveToken } from "@/lib/jwt";
import type { UserRole } from "@prisma/client";

/**
 * GET /api/auth/live-token
 *
 * Issues a short-lived JWT token for the live server (Fastify + Socket.io).
 * The token is signed with the same NEXTAUTH_SECRET so the live server
 * can verify it with jsonwebtoken.
 *
 * Supports both cookie-based sessions (web) and Bearer token auth (mobile).
 */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user?.id || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = generateLiveToken({
    userId: user.id,
    email: user.email,
    role: (user.role ?? "USER") as UserRole,
  });

  return NextResponse.json({ token });
}
