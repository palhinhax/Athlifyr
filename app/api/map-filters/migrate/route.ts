import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MapFiltersSchema,
  MigrateMapFiltersRequestSchema,
} from "@/lib/map-filters";
import { z } from "zod";

/**
 * POST /api/map-filters/migrate
 * Migrate filters from deviceId to userId on login
 * Applies merge strategy based on updatedAt timestamps
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceId } = MigrateMapFiltersRequestSchema.parse(body);

    // Fetch both presets
    const [devicePreset, userPreset] = await Promise.all([
      prisma.mapFilterPreset.findUnique({
        where: { deviceId },
      }),
      prisma.mapFilterPreset.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    let finalFilters;
    let shouldUpdate = false;

    // Case 1: Device has filters, user doesn't
    if (devicePreset && !userPreset) {
      finalFilters = MapFiltersSchema.parse(devicePreset.filters);
      shouldUpdate = true;
    }
    // Case 2: Both have filters - use most recent
    else if (devicePreset && userPreset) {
      const deviceUpdatedAt = new Date(devicePreset.updatedAt);
      const userUpdatedAt = new Date(userPreset.updatedAt);

      if (deviceUpdatedAt > userUpdatedAt) {
        finalFilters = MapFiltersSchema.parse(devicePreset.filters);
        shouldUpdate = true;
      } else {
        finalFilters = MapFiltersSchema.parse(userPreset.filters);
      }
    }
    // Case 3: Only user has filters (or neither)
    else if (userPreset) {
      finalFilters = MapFiltersSchema.parse(userPreset.filters);
    } else {
      // No filters exist - nothing to migrate
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    // Update user preset if needed
    let updatedPreset;
    if (shouldUpdate) {
      updatedPreset = await prisma.mapFilterPreset.upsert({
        where: { userId: session.user.id },
        update: {
          filters: finalFilters,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          filters: finalFilters,
        },
      });
    } else {
      updatedPreset = userPreset;
    }

    // Delete device preset after migration
    if (devicePreset) {
      await prisma.mapFilterPreset.delete({
        where: { deviceId },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        filters: MapFiltersSchema.parse(updatedPreset!.filters),
        updatedAt: updatedPreset!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error migrating map filters:", error);

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
        error: "Failed to migrate map filters",
      },
      { status: 500 }
    );
  }
}
