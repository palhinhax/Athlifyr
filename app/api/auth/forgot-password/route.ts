import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "node:crypto";
import {
  getPasswordResetEmailHtml,
  getPasswordResetEmailText,
} from "@/lib/email-templates";
import { forgotPasswordLimiter } from "@/lib/rate-limit";

// Initialize Resend lazily to avoid build-time errors when API key is missing
const getResend = () => {
  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === "re_placeholder"
  ) {
    throw new Error("RESEND_API_KEY not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/** Minimum response time (ms) to prevent timing-based email enumeration. */
const MIN_RESPONSE_TIME_MS = 800;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ code: "EMAIL_REQUIRED" }, { status: 400 });
    }

    // Rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const rateLimit = forgotPasswordLimiter.check(ip);
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

    const successMessage =
      "Se o email existir, receberás instruções para recuperar a password";

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      // Wait to ensure consistent response time regardless of user existence
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_RESPONSE_TIME_MS) {
        await new Promise((r) => setTimeout(r, MIN_RESPONSE_TIME_MS - elapsed));
      }
      return NextResponse.json({ message: successMessage });
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: resetToken,
        expires,
      },
    });

    // Send email with beautiful template
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    const resend = getResend();
    await resend.emails.send({
      from: "Athlifyr <noreply@athlifyr.com>",
      to: email,
      subject: "🔐 Recuperação de Password - Athlifyr",
      html: getPasswordResetEmailHtml({
        name: user.name || "Atleta",
        resetUrl,
      }),
      text: getPasswordResetEmailText({
        name: user.name || "Atleta",
        resetUrl,
      }),
    });

    return NextResponse.json({
      message: successMessage,
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
