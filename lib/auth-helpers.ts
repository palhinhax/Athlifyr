import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image?: string | null;
}

/**
 * Try to get an authenticated user from the NextAuth session (web app with cookies).
 */
async function getSessionUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth();
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || null,
      role: session.user.role || "USER",
      image: session.user.image,
    };
  } catch {
    console.log("NextAuth session not found, trying JWT token");
    return null;
  }
}

/**
 * Resolve the Authorization header from the request or from the Next.js
 * server context headers (works without passing request).
 */
async function resolveAuthHeader(
  request?: NextRequest | Request
): Promise<string | null> {
  if (request) {
    return request.headers.get("authorization");
  }
  try {
    const headersList = await headers();
    return headersList.get("authorization");
  } catch {
    // headers() not available in this context (e.g. middleware edge)
    return null;
  }
}

/**
 * Authenticate a user via JWT Bearer token from the Authorization header.
 */
async function authenticateWithJwt(
  authHeader: string
): Promise<AuthenticatedUser | null> {
  console.log("🔍 JWT Auth attempt:", {
    hasAuthHeader: true,
    authHeaderPrefix: authHeader.substring(0, 30),
  });

  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    console.log("❌ No JWT token found in Authorization header");
    return null;
  }

  console.log("🔑 JWT token extracted, verifying...");

  try {
    const payload = verifyToken(token);
    console.log("✅ JWT verified, userId:", payload.userId);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, image: true },
    });

    if (!user) {
      console.log("❌ User not found in database for userId:", payload.userId);
      return null;
    }

    console.log("✅ User found in database:", {
      userId: user.id,
      userName: user.name,
      email: user.email,
    });
    return user;
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
      });
    }
    return null;
  }
}

/**
 * Unified authentication helper that supports both:
 * 1. NextAuth session (web app with cookies)
 * 2. JWT Bearer tokens (mobile app)
 *
 * When no request is passed, falls back to next/headers() to read the
 * Authorization header from the current server context — this allows all
 * route handlers to support mobile JWT auth without needing to pass request.
 */
export async function getAuthenticatedUser(
  request?: NextRequest | Request
): Promise<AuthenticatedUser | null> {
  const sessionUser = await getSessionUser();
  if (sessionUser) return sessionUser;

  const authHeader = await resolveAuthHeader(request);
  if (!authHeader) {
    console.log(
      "⚠️ No Authorization header found in request or server context"
    );
    console.log("❌ Authentication failed - returning null");
    return null;
  }

  const jwtUser = await authenticateWithJwt(authHeader);
  if (jwtUser) return jwtUser;

  console.log("❌ Authentication failed - returning null");
  return null;
}
