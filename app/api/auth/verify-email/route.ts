import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/auth/verify-email?error=missing_params", request.url)
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        identifier: email.toLowerCase(),
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/auth/verify-email?error=invalid_token", request.url)
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email.toLowerCase(),
            token,
          },
        },
      });

      return NextResponse.redirect(
        new URL("/auth/verify-email?error=expired_token", request.url)
      );
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email.toLowerCase(),
          token,
        },
      },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL("/auth/verify-email?success=true", request.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(
      new URL("/auth/verify-email?error=server_error", request.url)
    );
  }
}
