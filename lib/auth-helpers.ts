import { NextRequest } from "next/server";
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
 */
export async function getAuthenticatedUser(
  request?: NextRequest
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

  // Try JWT Bearer token (for mobile app)
  if (request) {
    try {
      const authHeader = request.headers.get("authorization");
      console.log("🔍 JWT Auth attempt:", {
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader?.substring(0, 30),
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
    console.log("⚠️ No request object provided to getAuthenticatedUser");
  }

  console.log("❌ Authentication failed - returning null");
  return null;
}
