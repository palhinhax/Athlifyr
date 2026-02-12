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
      const token = extractTokenFromHeader(authHeader);

      if (token) {
        const payload = verifyToken(token);

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
          return user;
        }
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  return null;
}
