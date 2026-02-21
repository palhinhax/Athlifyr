import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { requireIntegrity } from "@/lib/verify-integrity";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const integrityError = await requireIntegrity(req);
    if (integrityError) return integrityError;

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
      const issue = error.issues[0];
      const codeMap: Record<string, string> = {
        too_small:
          issue.path[0] === "name"
            ? "NAME_TOO_SHORT"
            : issue.path[0] === "password"
              ? "PASSWORD_TOO_SHORT"
              : "VALIDATION_ERROR",
        invalid_string:
          issue.path[0] === "email" ? "EMAIL_INVALID" : "VALIDATION_ERROR",
      };
      return NextResponse.json(
        { code: codeMap[issue.code] ?? "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json({ code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
