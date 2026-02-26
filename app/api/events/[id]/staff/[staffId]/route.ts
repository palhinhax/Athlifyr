import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EventOrganizerRole, EventStaffRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string; staffId: string }>;
}

// PATCH /api/events/[id]/staff/[staffId] — change staff role
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: eventId, staffId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN";
  const callerOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const canManageStaff =
    isAdmin ||
    callerOrganizer?.role === EventOrganizerRole.OWNER ||
    callerOrganizer?.role === EventOrganizerRole.ADMIN;

  if (!canManageStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = await prisma.eventStaffMember.findUnique({
    where: { id: staffId },
  });
  if (!target || target.eventId !== eventId) {
    return NextResponse.json(
      { error: "Staff member not found" },
      { status: 404 }
    );
  }

  const body = (await req.json()) as { role: EventStaffRole };
  const { role } = body;

  if (!Object.values(EventStaffRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const updated = await prisma.eventStaffMember.update({
    where: { id: staffId },
    data: { role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/events/[id]/staff/[staffId] — remove staff member
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id: eventId, staffId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN";
  const callerOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const canManageStaff =
    isAdmin ||
    callerOrganizer?.role === EventOrganizerRole.OWNER ||
    callerOrganizer?.role === EventOrganizerRole.ADMIN;

  if (!canManageStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = await prisma.eventStaffMember.findUnique({
    where: { id: staffId },
  });
  if (!target || target.eventId !== eventId) {
    return NextResponse.json(
      { error: "Staff member not found" },
      { status: 404 }
    );
  }

  await prisma.eventStaffMember.delete({ where: { id: staffId } });

  return NextResponse.json({ success: true });
}
