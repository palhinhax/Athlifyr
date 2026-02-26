import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EventOrganizerRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string; organizerId: string }>;
}

// PATCH /api/events/[id]/organizers/[organizerId] — change role
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: eventId, organizerId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN";
  const callerOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const isOwner = callerOrganizer?.role === EventOrganizerRole.OWNER;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = await prisma.eventOrganizer.findUnique({
    where: { id: organizerId },
  });
  if (!target || target.eventId !== eventId) {
    return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
  }

  const body = (await req.json()) as { role: EventOrganizerRole };
  const { role } = body;

  if (!Object.values(EventOrganizerRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Only Platform Admin can assign or change OWNER role
  if (
    (role === EventOrganizerRole.OWNER ||
      target.role === EventOrganizerRole.OWNER) &&
    !isAdmin
  ) {
    return NextResponse.json(
      { error: "Only Platform Admin can manage OWNER role" },
      { status: 403 }
    );
  }

  const updated = await prisma.eventOrganizer.update({
    where: { id: organizerId },
    data: { role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/events/[id]/organizers/[organizerId] — remove organizer
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id: eventId, organizerId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN";
  const callerOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const isOwner = callerOrganizer?.role === EventOrganizerRole.OWNER;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = await prisma.eventOrganizer.findUnique({
    where: { id: organizerId },
  });
  if (!target || target.eventId !== eventId) {
    return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
  }

  // Cannot remove OWNER unless you're Platform Admin
  if (target.role === EventOrganizerRole.OWNER && !isAdmin) {
    return NextResponse.json(
      { error: "Only Platform Admin can remove the OWNER" },
      { status: 403 }
    );
  }

  await prisma.eventOrganizer.delete({ where: { id: organizerId } });

  return NextResponse.json({ success: true });
}
