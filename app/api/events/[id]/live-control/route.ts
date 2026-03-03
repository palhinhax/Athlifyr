// ============================================================================
// POST /api/events/[id]/live-control
//
// Called by event organizers from the manage page to control live race state.
// Supports: checkin | warmup | start | pause | resume | finish | cancel
//
// Enforces eligibility rules:
//  - Route must exist with >= 50 points and valid coordinates
//  - START + FINISH must be present (explicit or auto-derived)
//  - startTime is required for each variant
//  - Invalid configurations → LIVE_RACE_NOT_READY
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";
import { EventLiveStatus } from "@prisma/client";

const LIVE_SERVICE_URL =
  process.env.LIVE_SERVICE_URL ||
  process.env.NEXT_PUBLIC_LIVE_URL ||
  "http://localhost:4000";

/** Minimum number of route points for a valid LiveRace route. */
const MIN_ROUTE_POINTS = 50;

// Valid transitions per command
const COMMAND_TRANSITIONS: Record<
  string,
  { from: EventLiveStatus[]; to: EventLiveStatus }
> = {
  checkin: { from: ["SCHEDULED"], to: "CHECK_IN_OPEN" },
  warmup: { from: ["CHECK_IN_OPEN"], to: "WARMUP" },
  start: { from: ["WARMUP", "CHECK_IN_OPEN"], to: "LIVE" },
  pause: { from: ["LIVE"], to: "PAUSED" },
  resume: { from: ["PAUSED"], to: "LIVE" },
  finish: { from: ["LIVE", "PAUSED"], to: "FINISHED" },
  cancel: { from: ["LIVE", "PAUSED"], to: "CANCELLED" },
};

/** Commands that require full readiness validation before execution. */
const COMMANDS_REQUIRING_READINESS = new Set(["checkin", "warmup", "start"]);

interface ControlBody {
  command: string;
}

/**
 * Validate that a coordinate pair is within valid geographic bounds.
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  // Auth
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Permission: manage_event (organizers) or manage_liverace (admin)
  const ctx = await getUserEventContext(user.id, user.role, eventId);
  const canControl =
    hasEventPermission(ctx, "manage_liverace") ||
    hasEventPermission(ctx, "manage_event");

  if (!canControl) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as ControlBody;
  const { command } = body;

  const transition = COMMAND_TRANSITIONS[command];
  if (!transition) {
    return NextResponse.json({ error: "Invalid command" }, { status: 400 });
  }

  // Fetch event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      hasLiveRace: true,
      liveStatus: true,
      slug: true,
      variants: {
        select: {
          id: true,
          name: true,
          startTime: true,
          route: {
            select: {
              id: true,
              routePoints: true,
              checkpoints: {
                select: { type: true, order: true },
              },
            },
          },
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (!event.hasLiveRace) {
    return NextResponse.json(
      { error: "LiveRace not enabled for this event" },
      { status: 400 }
    );
  }

  if (!transition.from.includes(event.liveStatus)) {
    return NextResponse.json(
      {
        error: `Cannot execute '${command}' from status '${event.liveStatus}'`,
      },
      { status: 409 }
    );
  }

  // ─── Validate readiness before state-advancing commands ────────────────
  if (COMMANDS_REQUIRING_READINESS.has(command)) {
    const errors: string[] = [];

    if (event.variants.length === 0) {
      errors.push("No variants configured for this event");
    }

    for (const variant of event.variants) {
      const route = variant.route;
      const routePoints = route
        ? (route.routePoints as [number, number][])
        : [];
      const checkpoints = route?.checkpoints ?? [];

      // Route requirement: >= MIN_ROUTE_POINTS valid points
      if (!route || routePoints.length < MIN_ROUTE_POINTS) {
        errors.push(
          `Variant "${variant.name}" requires at least ${MIN_ROUTE_POINTS} route points (has ${routePoints.length})`
        );
        continue;
      }

      // Coordinate validation
      const hasInvalidCoords = routePoints.some(
        ([lat, lng]) => !isValidCoordinate(lat, lng)
      );
      if (hasInvalidCoords) {
        errors.push(
          `Variant "${variant.name}" contains invalid coordinates`
        );
        continue;
      }

      // Start/Finish: explicit checkpoints OR auto-derived from route endpoints
      const hasExplicitStart = checkpoints.some((cp) => cp.type === "START");
      const hasExplicitFinish = checkpoints.some((cp) => cp.type === "FINISH");
      const canDerive = routePoints.length >= MIN_ROUTE_POINTS;
      const hasStart = hasExplicitStart || canDerive;
      const hasFinish = hasExplicitFinish || canDerive;

      if (!hasStart) {
        errors.push(`Variant "${variant.name}" is missing a START checkpoint`);
      }
      if (!hasFinish) {
        errors.push(`Variant "${variant.name}" is missing a FINISH checkpoint`);
      }

      // startTime is required
      if (!variant.startTime) {
        errors.push(`Variant "${variant.name}" is missing a start time`);
      }

      // Checkpoint ordering validation (if checkpoints exist)
      if (checkpoints.length > 0) {
        const orders = checkpoints.map((cp) => cp.order);
        if (new Set(orders).size !== orders.length) {
          errors.push(
            `Variant "${variant.name}" has duplicate checkpoint orders`
          );
        }
        if (hasExplicitFinish) {
          const finishCp = checkpoints.find((cp) => cp.type === "FINISH");
          const maxOrder = Math.max(...orders);
          if (finishCp && finishCp.order !== maxOrder) {
            errors.push(
              `Variant "${variant.name}" FINISH checkpoint must be last in order`
            );
          }
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "LIVE_RACE_NOT_READY",
          message: errors.join("; "),
          details: errors,
        },
        { status: 422 }
      );
    }
  }

  // Update DB status
  await prisma.event.update({
    where: { id: eventId },
    data: { liveStatus: transition.to },
  });

  // Notify Live server
  try {
    await fetch(`${LIVE_SERVICE_URL}/internal/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-live-server": "true",
        "x-live-secret": process.env.LIVE_INTERNAL_SECRET ?? "",
      },
      body: JSON.stringify({ eventId, status: transition.to }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    // Non-fatal: DB is already updated — live server will sync on next poll
    console.warn("[live-control] Could not notify live server:", err);
  }

  // Return the new status only — the client updates its local state directly
  return NextResponse.json({
    liveStatus: transition.to,
  });
}
