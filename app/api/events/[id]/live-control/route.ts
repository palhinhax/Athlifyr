// ============================================================================
// POST /api/events/[id]/live-control
//
// Called by event organizers from the manage page to control live race state.
// Supports: checkin | start (warmup) | start (live) | pause | resume | finish
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
};

interface ControlBody {
  command: string;
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
          route: {
            select: {
              id: true,
              routePoints: true,
              checkpoints: {
                select: { type: true },
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

  // ─── Validate readiness before going LIVE ──────────────────────────────
  if (command === "start" && transition.to === "LIVE") {
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

      if (!route || routePoints.length < 2) {
        errors.push(`Variant "${variant.name}" has no route configured`);
        continue;
      }

      const hasStart = checkpoints.some((cp) => cp.type === "START");
      const hasFinish = checkpoints.some((cp) => cp.type === "FINISH");

      if (!hasStart) {
        errors.push(`Variant "${variant.name}" is missing a START checkpoint`);
      }
      if (!hasFinish) {
        errors.push(`Variant "${variant.name}" is missing a FINISH checkpoint`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: `Race not ready: ${errors.join("; ")}`,
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
