import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MapFiltersSchema,
  PutMapFiltersRequestSchema,
} from "@/lib/map-filters";
import { z } from "zod";

/**
 * GET /api/map-filters
 * Retrieve saved map filters for the current user or device
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    let preset = null;

    // Authenticated user - fetch by userId
    if (session?.user?.id) {
      preset = await prisma.mapFilterPreset.findUnique({
        where: { userId: session.user.id },
      });
    }
    // Anonymous user - fetch by deviceId
    else if (deviceId) {
      preset = await prisma.mapFilterPreset.findUnique({
        where: { deviceId },
      });
    }

    // Return null if no preset found
    if (!preset) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    // Validate and return filters
    const filters = MapFiltersSchema.parse(preset.filters);

    return NextResponse.json({
      success: true,
      data: {
        filters,
        updatedAt: preset.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching map filters:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filter data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch map filters",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/map-filters
 * Save or update map filters for the current user or device
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    // Validate request body
    const { deviceId, filters } = PutMapFiltersRequestSchema.parse(body);

    // Validate filters schema
    const validatedFilters = MapFiltersSchema.parse(filters);

    let preset;

    // Authenticated user - upsert by userId
    if (session?.user?.id) {
      preset = await prisma.mapFilterPreset.upsert({
        where: { userId: session.user.id },
        update: {
          filters: validatedFilters,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          filters: validatedFilters,
        },
      });
    }
    // Anonymous user - upsert by deviceId
    else if (deviceId) {
      preset = await prisma.mapFilterPreset.upsert({
        where: { deviceId },
        update: {
          filters: validatedFilters,
          updatedAt: new Date(),
        },
        create: {
          deviceId,
          filters: validatedFilters,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either user session or deviceId is required",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        filters: MapFiltersSchema.parse(preset.filters),
        updatedAt: preset.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error saving map filters:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save map filters",
      },
      { status: 500 }
    );
  }
}
