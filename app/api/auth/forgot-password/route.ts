import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import {
  getPasswordResetEmailHtml,
  getPasswordResetEmailText,
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

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message:
          "Se o email existir, receberás instruções para recuperar a password",
      });
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
      message:
        "Se o email existir, receberás instruções para recuperar a password",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}
