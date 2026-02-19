import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { requireIntegrity } from "@/lib/verify-integrity";

/**
 * POST /api/auth/google/exchange
 *
 * Mobile PKCE Authorization Code exchange endpoint.
 * Receives the authorization code + code_verifier from the mobile app,
 * exchanges it with Google for tokens (server-to-server),
 * validates the ID token, creates/finds the user, and returns app session tokens.
 */

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

interface ExchangeRequestBody {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  platform: "ios" | "android" | "web";
}

export async function POST(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const body: ExchangeRequestBody = await request.json();
    const { code, codeVerifier, redirectUri, platform } = body;

    if (!code || !codeVerifier || !redirectUri) {
      return NextResponse.json(
        { error: "code, codeVerifier, and redirectUri are required" },
        { status: 400 }
      );
    }

    if (!platform || !["ios", "android", "web"].includes(platform)) {
      return NextResponse.json(
        { error: "platform must be ios, android, or web" },
        { status: 400 }
      );
    }

    // Use the web client ID + secret for the server-to-server token exchange.
    // Google requires the web client credentials for authorization code exchange,
    // even when the code was obtained on a native client.
    const googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Exchange authorization code for tokens (server-to-server)
    const { tokens } = await googleClient.getToken({
      code,
      codeVerifier,
      redirect_uri: redirectUri,
    });

    if (!tokens.id_token) {
      return NextResponse.json(
        { error: "Google did not return an ID token" },
        { status: 400 }
      );
    }

    // Build the list of valid audiences: web + platform-specific client IDs
    const validAudiences = [
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_ANDROID_CLIENT_ID,
      process.env.GOOGLE_IOS_CLIENT_ID,
      process.env.GOOGLE_MOBILE_WEB_CLIENT_ID,
    ].filter(Boolean) as string[];

    // Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: validAudiences,
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

    // Find or create user
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
      // Update profile image if changed
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
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expiry_date
              ? Math.floor(tokens.expiry_date / 1000)
              : undefined,
            id_token: tokens.id_token,
          },
        });
      } else {
        // Update stored Google tokens
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
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_at: tokens.expiry_date
                ? Math.floor(tokens.expiry_date / 1000)
                : undefined,
              id_token: tokens.id_token,
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

    // Generate app session JWT tokens
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
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Google PKCE exchange error:", error);

    if (error instanceof Error) {
      // Handle specific Google errors
      if (error.message.includes("invalid_grant")) {
        return NextResponse.json(
          { error: "Authorization code expired or already used. Try again." },
          { status: 400 }
        );
      }
      if (error.message.includes("redirect_uri_mismatch")) {
        return NextResponse.json(
          { error: "Redirect URI mismatch. Check app configuration." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
