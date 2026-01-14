import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";

// GET - List all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        sportTypes: true,
        startDate: true,
        city: true,
        country: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create new event (admin only)
export async function POST(request: Request) {
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

    // Validate required fields
    if (!title || !startDate || !city) {
      return NextResponse.json(
        { error: "Title, startDate and city are required" },
        { status: 400 }
      );
    }

    // Validate sport type
    if (sportType && !Object.values(SportType).includes(sportType)) {
      return NextResponse.json(
        { error: "Invalid sport type" },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingSlug = await prisma.event.findFirst({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create event with variants
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description || "",
        sportTypes: sportType ? [sportType as SportType] : [SportType.RUNNING],
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        city,
        country: country || "Portugal",
        imageUrl: imageUrl || null,
        externalUrl: externalUrl || null,
        variants: {
          create:
            variants?.map(
              (v: {
                name: string;
                distanceKm: number | null;
                startDate?: string;
                startTime?: string;
              }) => ({
                name: v.name,
                distanceKm: v.distanceKm,
                startDate: v.startDate ? new Date(v.startDate) : null,
                startTime: v.startTime || null,
              })
            ) || [],
        },
      },
      include: {
        variants: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
