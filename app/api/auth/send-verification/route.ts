import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import {
  getEmailVerificationHtml,
  getEmailVerificationText,
} from "@/lib/email-templates";

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

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email.toLowerCase() },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email.toLowerCase(),
        token: verificationToken,
        expires,
      },
    });

    // Build verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email.toLowerCase())}`;

    // Send verification email
    const resend = getResend();
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Athlifyr <noreply@athlifyr.com>",
      to: user.email,
      subject: "Verifica o teu email - Athlifyr",
      html: getEmailVerificationHtml({
        name: user.name || "Atleta",
        verificationUrl,
      }),
      text: getEmailVerificationText({
        name: user.name || "Atleta",
        verificationUrl,
      }),
    });

    return NextResponse.json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
