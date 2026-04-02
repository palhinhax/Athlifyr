import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notifyEventInvite } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/events/[id]/invite
// Body: { userIds: string[] }
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userIds } = body as { userIds: string[] };

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: "userIds is required" }, { status: 400 });
  }

  // Cap at 50 invites per request
  const targetIds = userIds.slice(0, 50);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, slug: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Verify all targets are actual friends of the inviter
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: user.id, receiverId: { in: targetIds } },
        { receiverId: user.id, senderId: { in: targetIds } },
      ],
    },
    select: { senderId: true, receiverId: true },
  });

  const friendIds = new Set(
    friendships.map((f) => (f.senderId === user.id ? f.receiverId : f.senderId))
  );

  const validTargetIds = targetIds.filter((id) => friendIds.has(id));

  if (validTargetIds.length === 0) {
    return NextResponse.json({ invited: 0 });
  }

  // Send notifications in parallel
  await Promise.all(
    validTargetIds.map((userId) =>
      notifyEventInvite({
        userId,
        eventId: event.id,
        eventSlug: event.slug,
        eventTitle: event.title,
        inviterId: user.id,
        inviterName: user.name ?? "Someone",
        inviterImage: user.image,
      })
    )
  );

  return NextResponse.json({ invited: validTargetIds.length });
}
