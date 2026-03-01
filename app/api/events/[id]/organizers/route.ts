import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EventOrganizerRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/organizers — list organizers
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

  // Only admin, organizers, or staff can view the organizer list
  const isAdmin = user.role === "ADMIN";
  const isOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (!isAdmin && !isOrganizer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const organizers = await prisma.eventOrganizer.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      addedBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(organizers);
}

// POST /api/events/[id]/organizers — add organizer (Admin or OWNER only)
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

  // Only Platform Admin or OWNER can add organizers
  const isAdmin = user.role === "ADMIN";
  const existingOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const isOwner = existingOrganizer?.role === EventOrganizerRole.OWNER;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    userId?: string;
    email?: string;
    role: EventOrganizerRole;
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

  // Validate role
  if (!Object.values(EventOrganizerRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Only admin can assign OWNER
  if (role === EventOrganizerRole.OWNER && !isAdmin) {
    return NextResponse.json(
      { error: "Only Platform Admin can assign OWNER role" },
      { status: 403 }
    );
  }

  const targetUser = await prisma.user.findFirst({
    where: userId
      ? { id: userId }
      : { email: { equals: email, mode: "insensitive" } },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const resolvedUserId = targetUser.id;

  const organizer = await prisma.eventOrganizer.upsert({
    where: { eventId_userId: { eventId, userId: resolvedUserId } },
    create: { eventId, userId: resolvedUserId, role, addedById: user.id },
    update: { role, addedById: user.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(organizer, { status: 201 });
}
