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

    // Select the correct Google client credentials for the token exchange.
    // The authorization code is bound to the client_id that the mobile app used
    // to request it. The exchange MUST use that SAME client_id.
    //
    // - Web / Expo Go: uses GOOGLE_MOBILE_WEB_CLIENT_ID + secret (standard OAuth2)
    // - Android:       uses GOOGLE_ANDROID_CLIENT_ID without secret (PKCE only)
    // - iOS:           uses GOOGLE_IOS_CLIENT_ID without secret (PKCE only)
    //
    // Native OAuth clients (Android/iOS) do not have a client secret — Google
    // verifies the app via package name + SHA-1 (Android) or bundle ID (iOS).
    // PKCE (code_verifier) replaces the secret for the token exchange.
    const mobileWebClientId = process.env.GOOGLE_MOBILE_WEB_CLIENT_ID;
    const mobileWebClientSecret = process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET;

    let exchangeClientId: string | undefined;
    let exchangeClientSecret: string | undefined;

    switch (platform) {
      case "android":
        exchangeClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
        exchangeClientSecret = undefined; // Native PKCE: no secret needed
        break;
      case "ios":
        exchangeClientId = process.env.GOOGLE_IOS_CLIENT_ID;
        exchangeClientSecret = undefined; // Native PKCE: no secret needed
        break;
      default: // "web"
        exchangeClientId = mobileWebClientId;
        exchangeClientSecret = mobileWebClientSecret;
        break;
    }

    if (!exchangeClientId) {
      console.error(
        `[Google Exchange] Missing client ID for platform "${platform}". ` +
          `Check env: GOOGLE_${platform === "android" ? "ANDROID" : platform === "ios" ? "IOS" : "MOBILE_WEB"}_CLIENT_ID`
      );
      return NextResponse.json(
        { error: "Server OAuth configuration incomplete" },
        { status: 500 }
      );
    }

    if (platform === "web" && !exchangeClientSecret) {
      console.error(
        "[Google Exchange] Missing GOOGLE_MOBILE_WEB_CLIENT_SECRET in env"
      );
      return NextResponse.json(
        { error: "Server OAuth configuration incomplete" },
        { status: 500 }
      );
    }

    // Exchange authorization code for tokens (server-to-server).
    // For native platforms (Android/iOS), PKCE replaces the client secret,
    // so we call Google's token endpoint directly without a secret.
    // For web, we use OAuth2Client with the secret.
    let tokens: {
      id_token?: string | null;
      access_token?: string | null;
      refresh_token?: string | null;
      expiry_date?: number | null;
    };

    if (platform === "web") {
      const googleClient = new OAuth2Client(
        exchangeClientId,
        exchangeClientSecret,
        redirectUri
      );
      const result = await googleClient.getToken({
        code,
        codeVerifier,
        redirect_uri: redirectUri,
      });
      tokens = result.tokens;
    } else {
      // Native PKCE exchange: direct call to Google token endpoint without secret
      const params = new URLSearchParams({
        client_id: exchangeClientId,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.json().catch(() => ({}));
        console.error(
          `[Google Exchange] Native ${platform} token exchange failed:`,
          errorBody
        );
        const errorDesc =
          (errorBody as Record<string, string>).error_description ||
          (errorBody as Record<string, string>).error ||
          "Token exchange failed";
        return NextResponse.json({ error: errorDesc }, { status: 400 });
      }

      const tokenData = (await tokenResponse.json()) as Record<
        string,
        string | number
      >;
      tokens = {
        id_token: tokenData.id_token as string | undefined,
        access_token: tokenData.access_token as string | undefined,
        refresh_token: tokenData.refresh_token as string | undefined,
        expiry_date: tokenData.expires_in
          ? Date.now() + (tokenData.expires_in as number) * 1000
          : undefined,
      };
    }

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

    // Verify the ID token (use a standalone client — verification only needs a client ID)
    const verificationClient = new OAuth2Client(exchangeClientId);
    const ticket = await verificationClient.verifyIdToken({
      idToken: tokens.id_token!,
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

/** Handle CORS preflight requests from mobile app */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}
