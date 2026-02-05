import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { SportType, VenueService } from "@prisma/client";

// GET - Get venue by ID or slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const currentUserId = session?.user?.id;

    // Try to find by ID first, then by slug
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        members: {
          where: {
            status: "ACTIVE",
            role: {
              not: "CLIENT",
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        plans: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            // paymentProvider removed - now at venue level
            policy: true, // Include policy for editing
            isActive: true,
            createdAt: true,
            updatedAt: true,
            // Include user's subscription if logged in
            subscriptions: currentUserId
              ? {
                  where: {
                    userId: currentUserId,
                    status: "ACTIVE",
                  },
                  select: {
                    id: true,
                    status: true,
                    paymentStatus: true,
                    startsAt: true,
                    endsAt: true,
                    createdAt: true,
                  },
                  take: 1,
                }
              : false,
          },
        },
        _count: {
          select: {
            sessions: true,
            bookings: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Count unique active subscribers (users with at least one active subscription)
    const uniqueSubscribers = await prisma.venueSubscription.findMany({
      where: {
        venueId: venue.id,
        status: "ACTIVE",
      },
      select: {
        userId: true,
      },
      distinct: ["userId"],
    });

    // Add unique subscriber count to venue response
    const venueWithUniqueCount = {
      ...venue,
      _count: {
        ...(venue as { _count?: { sessions: number; bookings: number } })
          ._count,
        subscriptions: uniqueSubscribers.length,
      },
    };

    return NextResponse.json(venueWithUniqueCount);
  } catch (error) {
    console.error("Error fetching venue:", error);
    return NextResponse.json(
      { error: "Failed to fetch venue" },
      { status: 500 }
    );
  }
}

// PATCH - Update venue (owner/admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, id);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    console.log("Received venue update request:", body);
    console.log("Logo value:", body.logo);
    console.log("CoverImage value:", body.coverImage);

    const {
      name,
      type,
      sportTypes,
      description,
      phone,
      email,
      website,
      instagram,
      whatsapp,
      address,
      city,
      country,
      latitude,
      longitude,
      isActive,
      logo,
      coverImage,
      services,
      defaultSessionCapacity,
      defaultBookingAdvanceDays,
      defaultCancellationDeadlineMinutes,
      requiresPlanToBook,
    } = body;

    // Validate sport types if provided
    if (sportTypes && Array.isArray(sportTypes)) {
      const validSportTypes = sportTypes.every((sport: string) =>
        Object.values(SportType).includes(sport as SportType)
      );
      if (!validSportTypes) {
        return NextResponse.json(
          { error: "Invalid sport type(s)" },
          { status: 400 }
        );
      }
    }

    // Validate services if provided
    if (services && Array.isArray(services)) {
      const validServices = services.every((service: string) =>
        Object.values(VenueService).includes(service as VenueService)
      );
      if (!validServices) {
        return NextResponse.json(
          { error: "Invalid service type(s)" },
          { status: 400 }
        );
      }
    }

    // Update venue
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(sportTypes !== undefined && { sportTypes }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(instagram !== undefined && { instagram }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(isActive !== undefined && { isActive }),
        // Images: update if provided (even empty string to clear), but not if undefined
        ...(logo !== undefined && { logo: logo || null }),
        ...(coverImage !== undefined && {
          coverImage: coverImage || null,
        }),
        // Services
        ...(services !== undefined && { services }),
        // Session defaults
        ...(defaultSessionCapacity !== undefined && {
          defaultSessionCapacity,
        }),
        ...(defaultBookingAdvanceDays !== undefined && {
          defaultBookingAdvanceDays,
        }),
        ...(defaultCancellationDeadlineMinutes !== undefined && {
          defaultCancellationDeadlineMinutes,
        }),
        // Booking settings
        ...(requiresPlanToBook !== undefined && {
          requiresPlanToBook,
        }),
      },
    });

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error updating venue:", error);
    return NextResponse.json(
      { error: "Failed to update venue" },
      { status: 500 }
    );
  }
}

// DELETE - Delete venue (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is owner
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId: id,
          userId: session.user.id,
        },
      },
    });

    if (!member || member.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await prisma.venue.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Error deleting venue:", error);
    return NextResponse.json(
      { error: "Failed to delete venue" },
      { status: 500 }
    );
  }
}
