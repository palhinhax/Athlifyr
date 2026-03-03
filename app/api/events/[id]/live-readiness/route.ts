// ============================================================================
// GET /api/events/[id]/live-readiness
//
// Returns a readiness report for LiveRace — checks that all variants have
// valid routes, START/FINISH checkpoints, and startTime configured.
// Used by the admin manage page to show alerts/errors before the organizer
// starts the race. Backend enforcement: eligibility is validated here AND
// in /api/events/[id]/live-control before any state transition.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

/** Minimum number of route points for a valid LiveRace route. */
const MIN_ROUTE_POINTS = 50;

export interface VariantReadiness {
  variantId: string;
  variantName: string;
  hasRoute: boolean;
  routePointCount: number;
  hasStartCheckpoint: boolean;
  hasFinishCheckpoint: boolean;
  checkpointCount: number;
  hasStartTime: boolean;
  hasValidCoordinates: boolean;
}

export interface LiveReadinessResponse {
  ready: boolean;
  hasLiveRace: boolean;
  variantCount: number;
  variants: VariantReadiness[];
  errors: string[];
  warnings: string[];
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

/**
 * Validate that all route points contain valid coordinates.
 */
function areAllCoordinatesValid(points: [number, number][]): boolean {
  return points.every(([lat, lng]) => isValidCoordinate(lat, lng));
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
                  latitude: true,
                  longitude: true,
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
    const hasRoute = !!route && routePoints.length >= MIN_ROUTE_POINTS;
    const hasValidCoordinates =
      routePoints.length > 0 && areAllCoordinatesValid(routePoints);

    // Start/Finish: either explicit checkpoints or auto-derived from route endpoints
    const hasExplicitStart = checkpoints.some((cp) => cp.type === "START");
    const hasExplicitFinish = checkpoints.some((cp) => cp.type === "FINISH");
    const canDeriveStartFinish = hasRoute && hasValidCoordinates;
    const hasStart = hasExplicitStart || canDeriveStartFinish;
    const hasFinish = hasExplicitFinish || canDeriveStartFinish;

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
      hasValidCoordinates,
    });

    if (!route || routePoints.length === 0) {
      errors.push(`NO_ROUTE:${variant.name}`);
    } else if (routePoints.length < MIN_ROUTE_POINTS) {
      errors.push(`INSUFFICIENT_ROUTE_POINTS:${variant.name}`);
    }

    if (routePoints.length > 0 && !hasValidCoordinates) {
      errors.push(`INVALID_COORDINATES:${variant.name}`);
    }

    if (!hasStart) {
      errors.push(`NO_START:${variant.name}`);
    }

    if (!hasFinish) {
      errors.push(`NO_FINISH:${variant.name}`);
    }

    // startTime is now required (error, not warning)
    if (!hasStartTime) {
      errors.push(`NO_START_TIME:${variant.name}`);
    }

    // Checkpoint validation (optional but validated if present)
    if (checkpoints.length > 0) {
      // Check ordering: orders must be sequential and unique
      const orders = checkpoints.map((cp) => cp.order);
      const hasDuplicateOrders = new Set(orders).size !== orders.length;
      if (hasDuplicateOrders) {
        errors.push(`CHECKPOINT_DUPLICATE_ORDER:${variant.name}`);
      }

      // Ensure FINISH checkpoint is last in order
      if (hasExplicitFinish) {
        const finishCp = checkpoints.find((cp) => cp.type === "FINISH");
        const maxOrder = Math.max(...orders);
        if (finishCp && finishCp.order !== maxOrder) {
          errors.push(`CHECKPOINT_FINISH_NOT_LAST:${variant.name}`);
        }
      }
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
