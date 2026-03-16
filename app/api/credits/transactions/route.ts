import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { getTransactionHistory } from "@/lib/credits";

// GET - Get credit transaction history
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;
    const type = searchParams.get("type") || undefined;

    const result = await getTransactionHistory(user.id, {
      cursor,
      limit,
      type,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
