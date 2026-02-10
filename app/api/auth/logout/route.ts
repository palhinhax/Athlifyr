import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  // In a stateless JWT setup, logout is handled client-side by removing the token
  // This endpoint exists for compatibility and could be extended to:
  // - Add tokens to a blacklist (if implementing token revocation)
  // - Log logout events
  // - Clear any server-side session data

  return NextResponse.json({ message: "Logged out successfully" });
}
