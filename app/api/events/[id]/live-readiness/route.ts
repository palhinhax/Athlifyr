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
const MIN_ROUTE_POINTS = 10;

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
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
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

interface Checkpoint {
  id: string;
  type: string;
  name: string | null;
  order: number;
  latitude: number;
  longitude: number;
}

interface RouteData {
  id: string;
  routePoints: unknown;
  checkpoints: Checkpoint[];
}

interface VariantData {
  id: string;
  name: string;
  startTime: string | null;
  route: RouteData | null;
}

interface VariantValidationResult {
  readiness: VariantReadiness;
  errors: string[];
  warnings: string[];
}

function validateCheckpointOrdering(
  checkpoints: Checkpoint[],
  variantName: string,
  hasExplicitFinish: boolean
): string[] {
  const errors: string[] = [];
  const orders = checkpoints.map((cp) => cp.order);

  if (new Set(orders).size !== orders.length) {
    errors.push(`CHECKPOINT_DUPLICATE_ORDER:${variantName}`);
  }

  if (hasExplicitFinish) {
    const finishCp = checkpoints.find((cp) => cp.type === "FINISH");
    const maxOrder = Math.max(...orders);
    if (finishCp && finishCp.order !== maxOrder) {
      errors.push(`CHECKPOINT_FINISH_NOT_LAST:${variantName}`);
    }
  }

  return errors;
}

function validateVariant(variant: VariantData): VariantValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const route = variant.route;
  const routePoints = route ? (route.routePoints as [number, number][]) : [];
  const checkpoints = route?.checkpoints ?? [];
  const hasRoute = !!route && routePoints.length >= MIN_ROUTE_POINTS;
  const hasValidCoordinates =
    routePoints.length > 0 && areAllCoordinatesValid(routePoints);

  const hasExplicitStart = checkpoints.some((cp) => cp.type === "START");
  const hasExplicitFinish = checkpoints.some((cp) => cp.type === "FINISH");
  const canDeriveStartFinish = hasRoute && hasValidCoordinates;
  const hasStart = hasExplicitStart || canDeriveStartFinish;
  const hasFinish = hasExplicitFinish || canDeriveStartFinish;
  const hasStartTime = !!variant.startTime;

  const readiness: VariantReadiness = {
    variantId: variant.id,
    variantName: variant.name,
    hasRoute,
    routePointCount: routePoints.length,
    hasStartCheckpoint: hasStart,
    hasFinishCheckpoint: hasFinish,
    checkpointCount: checkpoints.length,
    hasStartTime,
    hasValidCoordinates,
  };

  if (!route || routePoints.length === 0) {
    errors.push(`NO_ROUTE:${variant.name}`);
  } else if (routePoints.length < MIN_ROUTE_POINTS) {
    errors.push(`INSUFFICIENT_ROUTE_POINTS:${variant.name}`);
  }

  if (routePoints.length > 0 && !hasValidCoordinates) {
    errors.push(`INVALID_COORDINATES:${variant.name}`);
  }
  if (!hasStart) errors.push(`NO_START:${variant.name}`);
  if (!hasFinish) errors.push(`NO_FINISH:${variant.name}`);
  if (!hasStartTime) errors.push(`NO_START_TIME:${variant.name}`);

  if (checkpoints.length > 0) {
    errors.push(
      ...validateCheckpointOrdering(
        checkpoints,
        variant.name,
        hasExplicitFinish
      )
    );
  }

  if (hasRoute && checkpoints.length === 0) {
    warnings.push(`NO_CHECKPOINTS:${variant.name}`);
  }

  return { readiness, errors, warnings };
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
    const result = validateVariant(variant);
    variants.push(result.readiness);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
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
