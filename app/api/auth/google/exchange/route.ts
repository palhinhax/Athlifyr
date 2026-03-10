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

interface OAuthTokens {
  id_token?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}

/** Thrown when the native PKCE token exchange HTTP request fails. */
class NativeTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NativeTokenError";
  }
}

/**
 * Returns the correct Google client credentials for the given platform.
 *
 * - Web / Expo Go: uses GOOGLE_MOBILE_WEB_CLIENT_ID + secret (standard OAuth2)
 * - Android / iOS: uses GOOGLE_ANDROID_CLIENT_ID without secret (PKCE only)
 *
 * Native OAuth clients do not have a client secret — Google verifies the app
 * via package name + SHA-1 (Android) or bundle ID (iOS). PKCE replaces the
 * secret for the token exchange.
 */
function getClientCredentials(platform: "ios" | "android" | "web"): {
  clientId: string | undefined;
  clientSecret: string | undefined;
} {
  switch (platform) {
    case "android":
    case "ios":
      return {
        clientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
        clientSecret: undefined,
      };
    default: // "web"
      return {
        clientId: process.env.GOOGLE_MOBILE_WEB_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET,
      };
  }
}

/** Exchanges an authorization code via OAuth2Client (web/Expo Go flow). */
async function exchangeWebToken(
  clientId: string,
  clientSecret: string,
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<OAuthTokens> {
  const googleClient = new OAuth2Client(clientId, clientSecret, redirectUri);
  const result = await googleClient.getToken({
    code,
    codeVerifier,
    redirect_uri: redirectUri,
  });
  return result.tokens;
}

/**
 * Exchanges an authorization code directly via Google's token endpoint (native PKCE flow).
 * Throws NativeTokenError if the exchange fails.
 */
async function exchangeNativeToken(
  clientId: string,
  code: string,
  codeVerifier: string,
  redirectUri: string,
  platform: string
): Promise<OAuthTokens> {
  const params = new URLSearchParams({
    client_id: clientId,
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
    throw new NativeTokenError(errorDesc);
  }

  const tokenData = (await tokenResponse.json()) as Record<
    string,
    string | number
  >;
  return {
    id_token: tokenData.id_token as string | undefined,
    access_token: tokenData.access_token as string | undefined,
    refresh_token: tokenData.refresh_token as string | undefined,
    expiry_date: tokenData.expires_in
      ? Date.now() + (tokenData.expires_in as number) * 1000
      : undefined,
  };
}

/** Links or updates the stored Google account tokens for an existing user. */
async function linkOrUpdateGoogleAccount(
  userId: string,
  googleId: string,
  tokens: OAuthTokens
): Promise<void> {
  const existingAccount = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  const accountData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expiry_date
      ? Math.floor(tokens.expiry_date / 1000)
      : undefined,
    id_token: tokens.id_token,
  };

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: accountData,
    });
  } else {
    await prisma.account.create({
      data: {
        userId,
        type: "oauth",
        provider: "google",
        providerAccountId: googleId,
        ...accountData,
      },
    });
  }
}

/** Finds an existing user by email or creates a new one, then links the Google account. */
async function upsertUser(
  googleId: string,
  normalizedEmail: string,
  name: string | undefined,
  picture: string | undefined,
  tokens: OAuthTokens
) {
  const user = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    select: { id: true, email: true, name: true, role: true, image: true },
  });

  if (user) {
    if (picture && picture !== user.image) {
      await prisma.user.update({
        where: { id: user.id },
        data: { image: picture },
      });
      user.image = picture;
    }
    await linkOrUpdateGoogleAccount(user.id, googleId, tokens);
    return user;
  }

  return prisma.user.create({
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
    select: { id: true, email: true, name: true, role: true, image: true },
  });
}

/** Maps a platform string to the corresponding env var name suffix for error messages. */
function platformEnvKey(platform: string): string {
  if (platform === "android" || platform === "ios") return "ANDROID";
  return "MOBILE_WEB";
}

/** Maps a caught error to the appropriate NextResponse. */
function handleExchangeError(error: unknown): NextResponse {
  if (error instanceof NativeTokenError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof Error) {
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
  return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
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

    const { clientId: exchangeClientId, clientSecret: exchangeClientSecret } =
      getClientCredentials(platform);

    if (!exchangeClientId) {
      console.error(
        `[Google Exchange] Missing client ID for platform "${platform}". ` +
          `Check env: GOOGLE_${platformEnvKey(platform)}_CLIENT_ID`
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

    const tokens =
      platform === "web"
        ? await exchangeWebToken(
            exchangeClientId,
            exchangeClientSecret ?? "",
            code,
            codeVerifier,
            redirectUri
          )
        : await exchangeNativeToken(
            exchangeClientId,
            code,
            codeVerifier,
            redirectUri,
            platform
          );

    if (!tokens.id_token) {
      return NextResponse.json(
        { error: "Google did not return an ID token" },
        { status: 400 }
      );
    }

    // Build the list of valid audiences for ID token verification
    const validAudiences = [
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_ANDROID_CLIENT_ID,
      process.env.GOOGLE_IOS_CLIENT_ID,
      process.env.GOOGLE_MOBILE_WEB_CLIENT_ID,
    ].filter(Boolean) as string[];

    // Verification only needs a client ID — use a standalone instance
    const verificationClient = new OAuth2Client(exchangeClientId);
    const ticket = await verificationClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: validAudiences,
    });

    const payload = ticket.getPayload() as GoogleTokenPayload | undefined;

    if (!payload?.email) {
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await upsertUser(
      googleId,
      normalizedEmail,
      name,
      picture,
      tokens
    );

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
    return handleExchangeError(error);
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
