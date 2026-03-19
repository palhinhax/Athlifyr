import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { requireIntegrity } from "@/lib/verify-integrity";
import { loginLimiter } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { code: "MISSING_CREDENTIALS" },
        { status: 400 }
      );
    }

    // Rate limit by IP + normalized email
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const rateLimitKey = `${ip}:${email.toLowerCase().trim()}`;
    const rateLimit = loginLimiter.check(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { code: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // Find user by normalized email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        image: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Generate tokens
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

    // Return user data and tokens (without password)
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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
