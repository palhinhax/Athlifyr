import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get event by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        variants: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH - Update event (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      sportType,
      startDate,
      endDate,
      city,
      country,
      imageUrl,
      externalUrl,
      variants,
    } = body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      include: { variants: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Generate slug if title changed
    let slug = existingEvent.slug;
    if (title && title !== existingEvent.title) {
      slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug already exists
      const existingSlug = await prisma.event.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(title && { slug }),
        ...(description !== undefined && { description }),
        ...(sportType && { sportType: sportType as SportType }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
        ...(city && { city }),
        ...(country && { country }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(externalUrl !== undefined && { externalUrl: externalUrl || null }),
      },
      include: {
        variants: true,
      },
    });

    // Handle variants if provided
    if (variants && Array.isArray(variants)) {
      // Delete existing variants
      await prisma.eventVariant.deleteMany({
        where: { eventId: params.id },
      });

      // Create new variants
      if (variants.length > 0) {
        await prisma.eventVariant.createMany({
          data: variants.map(
            (v: {
              name: string;
              distanceKm?: number;
              price?: number;
              startDate?: string;
              startTime?: string;
            }) => ({
              eventId: params.id,
              name: v.name,
              distanceKm: v.distanceKm || null,
              price: v.price || null,
              startDate: v.startDate ? new Date(v.startDate) : null,
              startTime: v.startTime || null,
            })
          ),
        });
      }

      // Fetch updated event with new variants
      const eventWithVariants = await prisma.event.findUnique({
        where: { id: params.id },
        include: { variants: true },
      });

      return NextResponse.json(eventWithVariants);
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete event (cascades to variants, comments, etc.)
    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
