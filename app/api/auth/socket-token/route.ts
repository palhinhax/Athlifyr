import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sign } from "jsonwebtoken";

// GET - Generate Socket.IO JWT token for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate JWT token with user ID
    const token = sign(
      {
        id: session.user.id,
        email: session.user.email,
      },
      secret,
      {
        expiresIn: "24h",
      }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating socket token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
