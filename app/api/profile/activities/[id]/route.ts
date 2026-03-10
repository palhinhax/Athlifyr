import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ── Shared helper: authenticate + resolve activity id ──

async function authenticateAndResolveId(
  request: NextRequest,
  params: Promise<{ id: string }>
): Promise<{ userId: string; activityId: string } | { error: NextResponse }> {
  const user = await getAuthenticatedUser(request);
  if (!user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const { id } = await params;
  return { userId: user.id, activityId: id };
}

function verifyOwnership(
  activityUserId: string,
  requestUserId: string
): NextResponse | null {
  if (activityUserId !== requestUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// ── GET /api/profile/activities/[id] — Get single activity with full GPS track ──

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const auth = await authenticateAndResolveId(request, params);
    if (!("userId" in auth)) return auth.error;

    const activity = await prisma.runActivity.findUnique({
      where: { id: auth.activityId },
      include: {
        performanceEntry: {
          select: { id: true },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const forbidden = verifyOwnership(activity.userId, auth.userId);
    if (forbidden) return forbidden;

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/profile/activities/[id] — Delete a GPS activity + linked performance entry ──

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const auth = await authenticateAndResolveId(request, params);
    if (!("userId" in auth)) return auth.error;

    const activity = await prisma.runActivity.findUnique({
      where: { id: auth.activityId },
      select: { userId: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const forbidden = verifyOwnership(activity.userId, auth.userId);
    if (forbidden) return forbidden;

    // Delete activity (performance entry unlinks via SetNull)
    await prisma.$transaction(async (tx) => {
      // First unlink the performance entry
      await tx.userPerformanceEntry.updateMany({
        where: { runActivityId: auth.activityId },
        data: { runActivityId: null },
      });
      // Then delete the activity
      await tx.runActivity.delete({ where: { id: auth.activityId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
