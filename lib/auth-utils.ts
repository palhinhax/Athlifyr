import { auth } from "@/lib/auth";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

/**
 * Authenticated user from either NextAuth session (web) or Bearer token (mobile)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

/**
 * Universal auth function that supports both:
 * - NextAuth session (web - httpOnly cookies)
 * - Bearer JWT token (mobile - Authorization header)
 *
 * Usage:
 * ```ts
 * const user = await getAuthUser(request);
 * if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * ```
 */
export async function getAuthUser(
  request: Request
): Promise<AuthenticatedUser | null> {
  // 1. Try NextAuth session first (web)
  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || null,
      role: (session.user.role as UserRole) || "USER",
      image: session.user.image || null,
    };
  }

  // 2. Fallback: Try Bearer token (mobile)
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);

    // Ensure it's an access token, not a refresh token
    if (payload.type === "refresh") {
      return null;
    }

    // Fetch fresh user data from DB to ensure it's still valid
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        isBanned: true,
      },
    });

    if (!user || user.isBanned) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    };
  } catch {
    return null;
  }
}
