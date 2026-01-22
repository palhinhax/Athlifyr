import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: List all drafts for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const drafts = await prisma.instagramPostDraft.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        templateKey: true,
        format: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new draft
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      console.error("❌ Unauthorized: No session or not admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateKey, format, payload } = body;

    console.log("📥 Received draft save request:", {
      userId: session.user.id,
      templateKey,
      format,
      payloadKeys: Object.keys(payload || {}),
      hasEvents: payload && "events" in payload,
    });

    if (!templateKey || !format || !payload) {
      console.error("❌ Missing required fields:", {
        templateKey,
        format,
        hasPayload: !!payload,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const draft = await prisma.instagramPostDraft.create({
      data: {
        userId: session.user.id,
        templateKey,
        format,
        payload,
      },
    });

    return NextResponse.json(draft);
  } catch (error) {
    console.error("❌ Error creating draft:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
