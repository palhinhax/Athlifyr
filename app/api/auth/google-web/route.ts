import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, type Credentials } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL + "/api/auth/google-web/callback"
);

function buildAccountData(
  userId: string,
  googleId: string,
  tokens: Credentials
) {
  return {
    userId,
    type: "oauth" as const,
    provider: "google" as const,
    providerAccountId: googleId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expiry_date
      ? Math.floor(tokens.expiry_date / 1000)
      : undefined,
    token_type: tokens.token_type,
    scope: tokens.scope,
    id_token: tokens.id_token,
  };
}

async function findOrCreateUser(
  email: string,
  googleId: string,
  name: string | null,
  picture: string | null,
  tokens: Credentials
) {
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: { email, name, image: picture, emailVerified: new Date() },
    });
    await prisma.account.create({
      data: buildAccountData(newUser.id, googleId, tokens),
    });
    return newUser;
  }

  // Update image if changed
  if (picture && existingUser.image !== picture) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { image: picture },
    });
  }

  // Update or create account link
  const existingAccount = await prisma.account.findFirst({
    where: { userId: existingUser.id, provider: "google" },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : undefined,
        id_token: tokens.id_token,
      },
    });
  } else {
    await prisma.account.create({
      data: buildAccountData(existingUser.id, googleId, tokens),
    });
  }

  return existingUser;
}

/**
 * POST /api/auth/google-web
 * Initiate Google OAuth flow for web
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "getAuthUrl") {
      // Generate OAuth URL for web login
      const authUrl = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
        prompt: "consent",
      });

      return NextResponse.json({ authUrl });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Google Web Auth Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/google-web/callback
 * Handle Google OAuth callback for web
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=no_code", request.url)
      );
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Verify and decode the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=invalid_token", request.url)
      );
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    const googleId = payload.sub;
    const name = payload.name || null;
    const picture = payload.picture || null;

    const user = await findOrCreateUser(
      normalizedEmail,
      googleId,
      name,
      picture,
      tokens
    );

    // Generate JWT tokens for the session
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with redirect
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set auth cookies
    response.cookies.set("auth-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days (matches JWT expiry)
      path: "/",
    });

    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days (matches refresh token expiry)
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Web Callback Error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=callback_failed", request.url)
    );
  }
}
