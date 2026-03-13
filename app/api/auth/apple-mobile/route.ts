import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import * as jose from "jose";
import type { UserRole } from "@prisma/client";

const APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys";
const appleJWKS = jose.createRemoteJWKSet(new URL(APPLE_JWKS_URI));

interface AppleTokenPayload {
  sub: string;
  email?: string;
  email_verified?: string | boolean;
  is_private_email?: string | boolean;
}

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

/** Build token pair + user JSON response for a successful auth */
function buildAuthResponse(user: AuthUser) {
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
}

function bannedResponse() {
  return NextResponse.json({ error: "Account is banned" }, { status: 403 });
}

/**
 * POST /api/auth/apple-mobile
 * Handle Apple Sign In from mobile (iOS) app.
 *
 * Receives the identityToken from expo-apple-authentication,
 * verifies it against Apple's public keys, and creates/logs in the user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identityToken, fullName } = body;

    if (!identityToken || typeof identityToken !== "string") {
      return NextResponse.json(
        { error: "identityToken is required" },
        { status: 400 }
      );
    }

    // Verify the Apple identity token using Apple's JWKS
    const { payload } = await jose.jwtVerify(identityToken, appleJWKS, {
      issuer: "https://appleid.apple.com",
      audience: process.env.APPLE_BUNDLE_ID || "com.athlifyr.app",
    });

    const applePayload = payload as unknown as AppleTokenPayload;
    const appleUserId = applePayload.sub;

    if (!appleUserId) {
      return NextResponse.json(
        { error: "Invalid Apple token" },
        { status: 401 }
      );
    }

    // Apple may not provide email on subsequent sign-ins — only on the first one.
    // We use the providerAccountId (sub) to find existing users.
    const email = applePayload.email?.toLowerCase().trim();

    // Build display name from fullName (Apple only sends this on first auth)
    const displayName =
      fullName?.givenName && fullName?.familyName
        ? `${fullName.givenName} ${fullName.familyName}`
        : fullName?.givenName || null;

    const userSelect = {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      isBanned: true,
    } as const;

    // 1. Check if an Apple account already exists for this user
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "apple",
          providerAccountId: appleUserId,
        },
      },
      include: { user: { select: userSelect } },
    });

    if (existingAccount) {
      const user = existingAccount.user;
      if (user.isBanned) return bannedResponse();

      // Update name if it was provided and user has no name
      if (displayName && !user.name) {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: displayName },
        });
        user.name = displayName;
      }

      return buildAuthResponse(user);
    }

    // 2. Check if a user with this email already exists (link accounts)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: userSelect,
      });

      if (existingUser) {
        if (existingUser.isBanned) return bannedResponse();

        // Link Apple account to existing user
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: "oauth",
            provider: "apple",
            providerAccountId: appleUserId,
          },
        });

        return buildAuthResponse(existingUser);
      }
    }

    // 3. Create a new user with Apple account
    // Apple may hide the real email (Private Relay) — we still need an email
    const userEmail = email || `${appleUserId}@privaterelay.appleid.com`;
    const userName = displayName || userEmail.split("@")[0];

    const newUser = await prisma.user.create({
      data: {
        email: userEmail,
        name: userName,
        emailVerified: new Date(),
        accounts: {
          create: {
            type: "oauth",
            provider: "apple",
            providerAccountId: appleUserId,
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

    return buildAuthResponse(newUser);
  } catch (error) {
    console.error("Apple mobile auth error:", error);

    if (error instanceof Error && error.message.includes("expired")) {
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
