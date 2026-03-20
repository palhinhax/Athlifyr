import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/integrity/challenge
 *
 * Generate a secure nonce for Play Integrity verification.
 * The nonce is a 32-byte random value encoded as base64url.
 *
 * Response:
 *   { nonce: string, timestamp: number }
 *
 * The mobile app must use this nonce within 60 seconds
 * to request a Play Integrity token.
 */
export async function POST() {
  try {
    // Generate 32 bytes of cryptographically secure random data
    const nonceBuffer = crypto.randomBytes(32);
    const nonce = nonceBuffer.toString("base64url");

    const timestamp = Date.now();

    return NextResponse.json({ nonce, timestamp }, { status: 200 });
  } catch (error) {
    console.error("[integrity/challenge] Error generating nonce:", error);
    return NextResponse.json(
      { error: "Failed to generate challenge" },
      { status: 500 }
    );
  }
}
