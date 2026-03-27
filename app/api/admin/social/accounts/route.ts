import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAccounts } from "@/lib/social-api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await getAccounts();
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch accounts",
      },
      { status: 500 }
    );
  }
}
