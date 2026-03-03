// ============================================================================
// GET /api/events/[id]/live-readiness
//
// Returns a readiness report for LiveRace — checks that all variants have
// routes with START and FINISH checkpoints configured. Used by the admin
// manage page to show alerts/errors before the organizer starts the race.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

export interface VariantReadiness {
  variantId: string;
  variantName: string;
  hasRoute: boolean;
  routePointCount: number;
  hasStartCheckpoint: boolean;
  hasFinishCheckpoint: boolean;
  checkpointCount: number;
  hasStartTime: boolean;
}

export interface LiveReadinessResponse {
  ready: boolean;
  hasLiveRace: boolean;
  variantCount: number;
  variants: VariantReadiness[];
  errors: string[];
  warnings: string[];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = await getUserEventContext(user.id, user.role, eventId);
  if (
    !hasEventPermission(ctx, "manage_event") &&
    !hasEventPermission(ctx, "manage_liverace")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      hasLiveRace: true,
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
                select: {
                  id: true,
                  type: true,
                  name: true,
                  order: true,
                },
                orderBy: { order: "asc" },
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

  const errors: string[] = [];
  const warnings: string[] = [];
  const variants: VariantReadiness[] = [];

  if (!event.hasLiveRace) {
    errors.push("LIVERACE_NOT_ENABLED");
  }

  if (event.variants.length === 0) {
    errors.push("NO_VARIANTS");
  }

  for (const variant of event.variants) {
    const route = variant.route;
    const routePoints = route ? (route.routePoints as [number, number][]) : [];
    const checkpoints = route?.checkpoints ?? [];
    const hasRoute = !!route && routePoints.length >= 2;
    const hasStart = checkpoints.some((cp) => cp.type === "START");
    const hasFinish = checkpoints.some((cp) => cp.type === "FINISH");
    const hasStartTime = !!variant.startTime;

    variants.push({
      variantId: variant.id,
      variantName: variant.name,
      hasRoute,
      routePointCount: routePoints.length,
      hasStartCheckpoint: hasStart,
      hasFinishCheckpoint: hasFinish,
      checkpointCount: checkpoints.length,
      hasStartTime,
    });

    if (!hasRoute) {
      errors.push(`NO_ROUTE:${variant.name}`);
    }

    if (!hasStart) {
      errors.push(`NO_START:${variant.name}`);
    }

    if (!hasFinish) {
      errors.push(`NO_FINISH:${variant.name}`);
    }

    if (!hasStartTime) {
      warnings.push(`NO_START_TIME:${variant.name}`);
    }

    if (hasRoute && checkpoints.length === 0) {
      warnings.push(`NO_CHECKPOINTS:${variant.name}`);
    }
  }

  const ready = event.hasLiveRace && errors.length === 0;

  return NextResponse.json<LiveReadinessResponse>({
    ready,
    hasLiveRace: event.hasLiveRace,
    variantCount: event.variants.length,
    variants,
    errors,
    warnings,
  });
}
