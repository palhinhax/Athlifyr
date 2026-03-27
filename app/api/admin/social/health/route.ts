import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getHealth } from "@/lib/social-api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const health = await getHealth();
    return NextResponse.json(health);
  } catch {
    return NextResponse.json(
      { status: "offline", error: "Social service is not reachable" },
      { status: 503 }
    );
  }
}
