import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as jose from "jose";
import crypto from "crypto";

/**
 * POST /api/admin/apple-secret
 * Generate a new Apple client secret JWT for Sign in with Apple (web).
 * Admin-only endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { privateKey, keyId, teamId, clientId, expiresInDays } = body;

    if (!privateKey || !keyId || !teamId || !clientId) {
      return NextResponse.json(
        {
          error: "All fields are required: privateKey, keyId, teamId, clientId",
        },
        { status: 400 }
      );
    }

    if (
      typeof expiresInDays !== "number" ||
      expiresInDays < 1 ||
      expiresInDays > 180
    ) {
      return NextResponse.json(
        { error: "expiresInDays must be between 1 and 180" },
        { status: 400 }
      );
    }

    // Parse the private key
    const key = crypto.createPrivateKey(privateKey);

    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = expiresInDays * 24 * 60 * 60;

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg: "ES256", kid: keyId })
      .setIssuer(teamId)
      .setSubject(clientId)
      .setAudience("https://appleid.apple.com")
      .setIssuedAt(now)
      .setExpirationTime(now + expiresInSeconds)
      .sign(key);

    const expiresAt = new Date((now + expiresInSeconds) * 1000).toISOString();

    return NextResponse.json({ secret: jwt, expiresAt });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate secret: ${error.message}` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate secret" },
      { status: 500 }
    );
  }
}
