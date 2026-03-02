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
  // Try NextAuth session first (for web app)
  try {
    const session = await auth();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || null,
        role: session.user.role || "USER",
        image: session.user.image,
      };
    }
  } catch {
    // NextAuth failed, try JWT Bearer token
    console.log("NextAuth session not found, trying JWT token");
  }

  // Resolve the Authorization header — from request if provided, otherwise
  // from the Next.js server context headers (works without passing request)
  let authHeader: string | null = null;

  if (request) {
    authHeader = request.headers.get("authorization");
  } else {
    try {
      const headersList = await headers();
      authHeader = headersList.get("authorization");
    } catch {
      // headers() not available in this context (e.g. middleware edge)
    }
  }

  if (authHeader) {
    try {
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
      const payload = verifyToken(token);

      console.log("✅ JWT verified, userId:", payload.userId);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
        },
      });

      if (user) {
        console.log("✅ User found in database:", {
          userId: user.id,
          userName: user.name,
          email: user.email,
        });
        return user;
      } else {
        console.log(
          "❌ User not found in database for userId:",
          payload.userId
        );
      }
    } catch (error) {
      console.error("❌ JWT verification failed:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
        });
      }
    }
  } else {
    console.log(
      "⚠️ No Authorization header found in request or server context"
    );
  }

  console.log("❌ Authentication failed - returning null");
  return null;
}
