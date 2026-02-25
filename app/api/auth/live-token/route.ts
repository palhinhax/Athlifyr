import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAccessToken } from "@/lib/jwt";

/**
 * GET /api/auth/live-token
 *
 * Issues a short-lived JWT token for the live server (Fastify + Socket.io).
 * The token is signed with the same NEXTAUTH_SECRET so the live server
 * can verify it with jsonwebtoken.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = generateAccessToken({
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role ?? "USER",
  });

  return NextResponse.json({ token });
}
