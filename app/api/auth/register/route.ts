import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { requireIntegrity } from "@/lib/verify-integrity";
import { registerLimiter } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

function mapZodErrorCode(issue: z.ZodIssue): string {
  const field = issue.path[0];
  if (issue.code === "too_small") {
    if (field === "name") return "NAME_TOO_SHORT";
    if (field === "password") return "PASSWORD_TOO_SHORT";
  }
  if (issue.code === "invalid_format" && field === "email") {
    return "EMAIL_INVALID";
  }
  return "VALIDATION_ERROR";
}

export async function POST(req: NextRequest) {
  try {
    const integrityError = await requireIntegrity(req);
    if (integrityError) return integrityError;

    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimit = registerLimiter.check(ip);
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

    const body = await req.json();
    const { name, email: rawEmail, password } = registerSchema.parse(body);

    // Normalize email to lowercase
    const email = rawEmail.toLowerCase().trim();

    // Check if user already exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { code: "EMAIL_ALREADY_IN_USE" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Track successful registration on server
    await trackServerEvent(
      ANALYTICS_EVENTS.SIGNUP_COMPLETED,
      {
        method: "email",
        userId: user.id,
      },
      user.email
    );

    return NextResponse.json(
      { message: "Conta criada com sucesso", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { code: mapZodErrorCode(error.issues[0]) },
        { status: 400 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json({ code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
