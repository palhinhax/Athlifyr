import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { buildAuthResponse } from "@/lib/mobile-auth-response";
import { requireIntegrity } from "@/lib/verify-integrity";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    // Verify the Google ID token
    // The audience must include the webClientId used in GoogleSignin.configure()
    // on the mobile app, which may differ from the web GOOGLE_CLIENT_ID
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID!,
        // Mobile web client ID (used in GoogleSignin.configure({ webClientId }))
        process.env.GOOGLE_MOBILE_WEB_CLIENT_ID || "",
        // Android client ID
        process.env.GOOGLE_ANDROID_CLIENT_ID || "",
      ].filter(Boolean),
    });

    const payload = ticket.getPayload() as GoogleTokenPayload | undefined;

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists (by email, case-insensitive)
    let user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });

    if (user) {
      // User exists — update Google profile image if available
      if (picture && picture !== user.image) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: picture },
        });
        user.image = picture;
      }

      // Ensure Google account is linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
      });

      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: googleId,
          },
        });
      }
    } else {
      // Create new user with Google account
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          image: picture || null,
          emailVerified: new Date(),
          accounts: {
            create: {
              type: "oauth",
              provider: "google",
              providerAccountId: googleId,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
        },
      });
    }

    return buildAuthResponse(user);
  } catch (error) {
    console.error("Google mobile auth error:", error);

    // Handle specific Google token verification errors
    if (error instanceof Error && error.message.includes("Token used too")) {
      return NextResponse.json(
        { error: "Token expired. Please try signing in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
