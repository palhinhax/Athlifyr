import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAuthUrl } from "@/lib/social-api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authUrl = await getAuthUrl(session.user.id);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error getting social auth URL:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get auth URL",
      },
      { status: 500 }
    );
  }
}
