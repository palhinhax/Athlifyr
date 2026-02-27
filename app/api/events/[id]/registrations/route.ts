import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/registrations — list all registrations + free participations
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Only admin or organizers can view registrations
  const isAdmin = user.role === "ADMIN";
  const isOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (!isAdmin && !isOrganizer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const variantFilter = searchParams.get("variant");
  const statusFilter = searchParams.get("status");

  // Fetch paid registrations
  const registrations = await prisma.registration.findMany({
    where: {
      eventId,
      ...(variantFilter ? { variantId: variantFilter } : {}),
      ...(statusFilter
        ? {
            status: statusFilter as
              | "PENDING"
              | "CONFIRMED"
              | "CANCELLED"
              | "REFUNDED",
          }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      variant: {
        select: { id: true, name: true, distanceKm: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch free participations (only if event doesn't have paid registrations,
  // or to show complementary data)
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      ...(variantFilter ? { variantId: variantFilter } : {}),
      ...(statusFilter === "going" || statusFilter === "interested"
        ? { status: statusFilter }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      variant: {
        select: { id: true, name: true, distanceKm: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch variants for filter dropdown
  const variants = await prisma.eventVariant.findMany({
    where: { eventId },
    select: { id: true, name: true, distanceKm: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    registrations: registrations.map((r) => ({
      id: r.id,
      type: "paid" as const,
      userId: r.userId,
      userName: r.user.name,
      userEmail: r.user.email,
      userImage: r.user.image,
      variantId: r.variantId,
      variantName: r.variant.name,
      variantDistance: r.variant.distanceKm,
      status: r.status,
      bibNumber: r.bibNumber,
      checkedInAt: r.checkedInAt?.toISOString() ?? null,
      amountCents: r.amountCents,
      currency: r.currency,
      createdAt: r.createdAt.toISOString(),
    })),
    participations: participations.map((p) => ({
      id: p.id,
      type: "free" as const,
      userId: p.userId,
      userName: p.user.name,
      userEmail: p.user.email,
      userImage: p.user.image,
      variantId: p.variantId,
      variantName: p.variant?.name ?? null,
      variantDistance: p.variant?.distanceKm ?? null,
      status: p.status,
      bibNumber: null,
      checkedInAt: null,
      amountCents: null,
      currency: null,
      createdAt: p.createdAt.toISOString(),
    })),
    variants,
    counts: {
      totalRegistrations: registrations.length,
      confirmedRegistrations: registrations.filter(
        (r) => r.status === "CONFIRMED"
      ).length,
      pendingRegistrations: registrations.filter((r) => r.status === "PENDING")
        .length,
      cancelledRegistrations: registrations.filter(
        (r) => r.status === "CANCELLED" || r.status === "REFUNDED"
      ).length,
      totalParticipations: participations.length,
      goingParticipations: participations.filter((p) => p.status === "going")
        .length,
      interestedParticipations: participations.filter(
        (p) => p.status === "interested"
      ).length,
    },
  });
}
