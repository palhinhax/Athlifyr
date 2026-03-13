import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildAuthResponse,
  bannedResponse,
  type MobileAuthUser,
} from "@/lib/mobile-auth-response";
import * as jose from "jose";

const APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys";
const appleJWKS = jose.createRemoteJWKSet(new URL(APPLE_JWKS_URI));

interface AppleTokenPayload {
  sub: string;
  email?: string;
  email_verified?: string | boolean;
  is_private_email?: string | boolean;
}

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  image: true,
  isBanned: true,
} as const;

/** Build display name from Apple fullName (only sent on first auth) */
function buildDisplayName(
  fullName: { givenName?: string; familyName?: string } | null
): string | null {
  if (!fullName?.givenName) return null;
  return fullName.familyName
    ? `${fullName.givenName} ${fullName.familyName}`
    : fullName.givenName;
}

/** Handle returning user with existing Apple account */
async function handleExistingAccount(
  user: MobileAuthUser & { isBanned: boolean },
  displayName: string | null
) {
  if (user.isBanned) return bannedResponse();

  if (displayName && !user.name) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: displayName },
    });
    user.name = displayName;
  }

  return buildAuthResponse(user);
}

/** Link Apple account to existing user found by email */
async function handleEmailLinking(email: string, appleUserId: string) {
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: USER_SELECT,
  });

  if (!existingUser) return null;
  if (existingUser.isBanned) return bannedResponse();

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

/** Create a brand-new user with Apple account */
async function createNewUser(
  email: string | undefined,
  appleUserId: string,
  displayName: string | null
) {
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

    const email = applePayload.email?.toLowerCase().trim();
    const displayName = buildDisplayName(fullName);

    // 1. Check if an Apple account already exists for this user
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "apple",
          providerAccountId: appleUserId,
        },
      },
      include: { user: { select: USER_SELECT } },
    });

    if (existingAccount) {
      return handleExistingAccount(existingAccount.user, displayName);
    }

    // 2. Check if a user with this email already exists (link accounts)
    if (email) {
      const linkResponse = await handleEmailLinking(email, appleUserId);
      if (linkResponse) return linkResponse;
    }

    // 3. Create a new user with Apple account
    return createNewUser(email, appleUserId, displayName);
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
