import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EventOrganizerRole, EventStaffRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/staff — list staff members
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const isAdmin = user.role === "ADMIN";
  const isOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (!isAdmin && !isOrganizer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const staff = await prisma.eventStaffMember.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      addedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(staff);
}

// POST /api/events/[id]/staff — add staff (Admin, OWNER, or ADMIN organizer)
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
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

  const body = (await req.json()) as {
    userId?: string;
    email?: string;
    role: EventStaffRole;
  };
  const { userId, email, role } = body;

  if (!userId && !email) {
    return NextResponse.json(
      { error: "userId or email is required" },
      { status: 400 }
    );
  }

  if (!role) {
    return NextResponse.json({ error: "role is required" }, { status: 400 });
  }

  if (!Object.values(EventStaffRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const targetUser = await prisma.user.findFirst({
    where: userId
      ? { id: userId }
      : { email: { equals: email, mode: "insensitive" } },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const staffMember = await prisma.eventStaffMember.upsert({
    where: { eventId_userId: { eventId, userId: targetUser.id } },
    create: { eventId, userId: targetUser.id, role, addedById: user.id },
    update: { role, addedById: user.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(staffMember, { status: 201 });
}
