import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  buildCSVRow,
  buildExportFilename,
  formatCentsDecimal,
  formatDateISO,
} from "@/lib/csv-export";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Allowed organizer roles for export. */
const EXPORT_ALLOWED_ROLES = new Set(["OWNER", "ADMIN", "FINANCE"]);

// GET /api/events/[id]/registrations/export — stream CSV of registrations
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  // ── Auth ───────────────────────────────────────────────────────────────────
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, slug: true, title: true, hasRegistrations: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Platform admin or authorised organizer
  const isPlatformAdmin = user.role === "ADMIN";
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
    select: { role: true },
  });

  if (!isPlatformAdmin && !organizer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (organizer && !EXPORT_ALLOWED_ROLES.has(organizer.role)) {
    return NextResponse.json(
      { error: "Your role does not permit exports" },
      { status: 403 }
    );
  }

  // ── Filters ────────────────────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const variantFilter = searchParams.get("variant");
  const statusFilter = searchParams.get("status");
  const searchQuery = searchParams.get("search")?.toLowerCase();

  // ── Fetch custom fields ────────────────────────────────────────────────────
  const customFields = await prisma.eventCustomField.findMany({
    where: { eventId },
    orderBy: { order: "asc" },
    select: { id: true, label: true },
  });

  // ── Fetch paid registrations ───────────────────────────────────────────────
  const registrations = await prisma.registration.findMany({
    where: {
      eventId,
      ...(variantFilter ? { variantId: variantFilter } : {}),
      ...(statusFilter &&
      ["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED"].includes(statusFilter)
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
      user: { select: { name: true, email: true } },
      variant: { select: { name: true } },
      customFieldResponses: {
        select: { customFieldId: true, value: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // ── Fetch free participations ──────────────────────────────────────────────
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      ...(variantFilter ? { variantId: variantFilter } : {}),
      ...(statusFilter === "going" || statusFilter === "interested"
        ? { status: statusFilter }
        : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      variant: { select: { name: true } },
      customFieldResponses: {
        select: { customFieldId: true, value: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // ── Build unified rows ─────────────────────────────────────────────────────

  interface UnifiedRow {
    registrationId: string;
    type: string;
    createdAt: Date;
    status: string;
    variantName: string;
    bibNumber: string;
    athleteFullName: string;
    athleteEmail: string;
    checkedInAt: Date | null;
    amountCents: number | null;
    feeCents: number | null;
    netCents: number | null;
    currency: string;
    paymentProvider: string;
    stripePaymentIntentId: string;
    customFieldValues: Map<string, string>;
  }

  const rows: UnifiedRow[] = [];

  for (const r of registrations) {
    const cfMap = new Map<string, string>();
    for (const resp of r.customFieldResponses) {
      cfMap.set(resp.customFieldId, resp.value);
    }
    rows.push({
      registrationId: r.id,
      type: "paid",
      createdAt: r.createdAt,
      status: r.status,
      variantName: r.variant.name,
      bibNumber: r.bibNumber ?? "",
      athleteFullName: r.user.name ?? "",
      athleteEmail: r.user.email,
      checkedInAt: r.checkedInAt,
      amountCents: r.amountCents,
      feeCents: r.feeCents,
      netCents: r.netCents,
      currency: r.currency,
      paymentProvider: r.paymentProvider,
      stripePaymentIntentId: r.stripePaymentIntentId ?? "",
      customFieldValues: cfMap,
    });
  }

  for (const p of participations) {
    const cfMap = new Map<string, string>();
    for (const resp of p.customFieldResponses) {
      cfMap.set(resp.customFieldId, resp.value);
    }
    rows.push({
      registrationId: p.id,
      type: "free",
      createdAt: p.createdAt,
      status: p.status,
      variantName: p.variant?.name ?? "",
      bibNumber: "",
      athleteFullName: p.user.name ?? "",
      athleteEmail: p.user.email,
      checkedInAt: null,
      amountCents: null,
      feeCents: null,
      netCents: null,
      currency: "",
      paymentProvider: "",
      stripePaymentIntentId: "",
      customFieldValues: cfMap,
    });
  }

  // ── Apply search filter (server-side) ──────────────────────────────────────
  const filtered = searchQuery
    ? rows.filter(
        (r) =>
          r.athleteFullName.toLowerCase().includes(searchQuery) ||
          r.athleteEmail.toLowerCase().includes(searchQuery) ||
          r.bibNumber.toLowerCase().includes(searchQuery)
      )
    : rows;

  // ── Build CSV ──────────────────────────────────────────────────────────────
  const headers = [
    "registrationId",
    "createdAt",
    "status",
    "type",
    "variantName",
    "bibNumber",
    "athleteFullName",
    "athleteEmail",
    "checkedInAt",
    "amountCents",
    "feeCents",
    "netCents",
    "currency",
    "paymentProvider",
    "stripePaymentIntentId",
    ...customFields.map((f) => f.label),
  ];

  const BOM = "\uFEFF";
  const headerRow = buildCSVRow(headers);

  const dataRows = filtered.map((r) =>
    buildCSVRow([
      r.registrationId,
      formatDateISO(r.createdAt),
      r.status,
      r.type,
      r.variantName,
      r.bibNumber,
      r.athleteFullName,
      r.athleteEmail,
      formatDateISO(r.checkedInAt),
      r.amountCents != null ? formatCentsDecimal(r.amountCents) : "",
      r.feeCents != null ? formatCentsDecimal(r.feeCents) : "",
      r.netCents != null ? formatCentsDecimal(r.netCents) : "",
      r.currency,
      r.paymentProvider,
      r.stripePaymentIntentId,
      ...customFields.map((f) => r.customFieldValues.get(f.id) ?? ""),
    ])
  );

  // ── Determine filename ───────────────────────────────────────────────────
  let variantSlug: string | null = null;
  if (variantFilter) {
    const v = await prisma.eventVariant.findUnique({
      where: { id: variantFilter },
      select: { name: true },
    });
    variantSlug = v?.name ?? null;
  }

  const filename = buildExportFilename(event.slug, variantSlug);

  // ── Stream response ────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(BOM + headerRow));
      for (const row of dataRows) {
        controller.enqueue(encoder.encode(row));
      }
      controller.close();
    },
  });

  // ── Audit log ──────────────────────────────────────────────────────────────
  console.log(
    `[AUDIT] CSV export: user=${user.id} (${user.email}), event=${eventId}, ` +
      `filters={variant=${variantFilter ?? "all"}, status=${statusFilter ?? "all"}, search=${searchQuery ?? "none"}}, ` +
      `rows=${filtered.length}, file=${filename}`
  );

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
