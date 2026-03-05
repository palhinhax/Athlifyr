// ============================================================================
// Internal API: POST /api/internal/live-friends
//
// Called by the Live Server to get the list of accepted friend IDs for a user.
// Used for LiveRace visibility filtering (FRIENDS mode).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isLiveServer(request: NextRequest): boolean {
  const liveHeader = request.headers.get("x-live-server");
  if (liveHeader !== "true") return false;
  const secret = request.headers.get("x-live-secret");
  const expectedSecret = process.env.LIVE_INTERNAL_SECRET;
  if (expectedSecret && secret !== expectedSecret) return false;
  return true;
}

interface FriendsBody {
  userId: string;
}

export async function POST(request: NextRequest) {
  if (!isLiveServer(request)) {
    return NextResponse.json(
      { error: "Forbidden — internal endpoint" },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as FriendsBody;
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get all accepted friendships for this user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    // Extract friend IDs (the other user in each friendship)
    const friendIds = friendships.map((f) =>
      f.senderId === userId ? f.receiverId : f.senderId
    );

    return NextResponse.json({ friendIds });
  } catch (error) {
    console.error("[Internal] Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
