import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const PAGE_SIZE_DEFAULT = 25;
const PAGE_SIZE_MAX = 100;

const VALID_REG_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
] as const;
type RegStatus = (typeof VALID_REG_STATUSES)[number];

// GET /api/events/[id]/registrations — list registrations + free participations (paginated)
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

  // Only admin or organizers/staff can view registrations
  const isAdmin = user.role === "ADMIN";
  const [organizer, staff] = await Promise.all([
    prisma.eventOrganizer.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
    }),
    prisma.eventStaffMember.findFirst({ where: { eventId, userId: user.id } }),
  ]);

  if (!isAdmin && !organizer && !staff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const variantFilter = searchParams.get("variant");
  const statusFilter = searchParams.get("status");
  const checkedInFilter = searchParams.get("checkedIn"); // "true" | "false" | null
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() ?? null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(
      1,
      parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE_DEFAULT), 10)
    )
  );
  const skip = (page - 1) * pageSize;

  // ── Build WHERE clauses ────────────────────────────────────────────────────

  const regWhere: Prisma.RegistrationWhereInput = { eventId };
  if (variantFilter) regWhere.variantId = variantFilter;
  if (
    statusFilter &&
    (VALID_REG_STATUSES as readonly string[]).includes(statusFilter)
  ) {
    regWhere.status = statusFilter as RegStatus;
  }
  if (checkedInFilter === "true") {
    regWhere.checkedInAt = { not: null };
  } else if (checkedInFilter === "false") {
    regWhere.checkedInAt = null;
  }
  if (searchQuery) {
    regWhere.OR = [
      { user: { name: { contains: searchQuery, mode: "insensitive" } } },
      { user: { email: { contains: searchQuery, mode: "insensitive" } } },
      { bibNumber: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const parWhere: Prisma.ParticipationWhereInput = { eventId };
  if (variantFilter) parWhere.variantId = variantFilter;
  if (statusFilter === "going" || statusFilter === "interested") {
    parWhere.status = statusFilter;
  }
  if (searchQuery) {
    parWhere.OR = [
      { user: { name: { contains: searchQuery, mode: "insensitive" } } },
      { user: { email: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  // ── Summary counts (unfiltered by page, but filtered by variant/status/search) ──
  const [
    totalRegistrations,
    confirmedRegistrations,
    pendingRegistrations,
    cancelledRegistrations,
    checkedInRegistrations,
    totalParticipations,
    goingParticipations,
    interestedParticipations,
  ] = await Promise.all([
    prisma.registration.count({ where: regWhere }),
    prisma.registration.count({ where: { ...regWhere, status: "CONFIRMED" } }),
    prisma.registration.count({ where: { ...regWhere, status: "PENDING" } }),
    prisma.registration.count({
      where: {
        ...regWhere,
        status: { in: ["CANCELLED", "REFUNDED"] },
      },
    }),
    prisma.registration.count({
      where: { ...regWhere, checkedInAt: { not: null } },
    }),
    prisma.participation.count({ where: parWhere }),
    prisma.participation.count({ where: { ...parWhere, status: "going" } }),
    prisma.participation.count({
      where: { ...parWhere, status: "interested" },
    }),
  ]);

  // ── Paginated data fetch ───────────────────────────────────────────────────

  const [registrations, participations, variants] = await Promise.all([
    prisma.registration.findMany({
      where: regWhere,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        variant: { select: { id: true, name: true, distanceKm: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.participation.findMany({
      where: parWhere,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        variant: { select: { id: true, name: true, distanceKm: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.eventVariant.findMany({
      where: { eventId },
      select: { id: true, name: true, distanceKm: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalItems = totalRegistrations + totalParticipations;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

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
      totalRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      checkedInRegistrations,
      totalParticipations,
      goingParticipations,
      interestedParticipations,
    },
    pagination: {
      page,
      pageSize,
      total: totalItems,
      totalPages,
    },
  });
}
