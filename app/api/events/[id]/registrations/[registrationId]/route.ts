import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string; registrationId: string }>;
}

// DELETE /api/events/[id]/registrations/[registrationId]
// Admin-only: delete a registration or participation
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only app admins can delete registrations
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: eventId, registrationId } = await params;

    // Try to find as a paid registration first
    const registration = await prisma.registration.findFirst({
      where: {
        id: registrationId,
        eventId,
      },
    });

    if (registration) {
      await prisma.registration.delete({
        where: { id: registration.id },
      });

      console.log(
        `Admin ${user.id} deleted registration ${registration.id} (status: ${registration.status}) for event ${eventId}`
      );

      return NextResponse.json(
        { deleted: true, type: "registration" },
        { status: 200 }
      );
    }

    // Try as a free participation
    const participation = await prisma.participation.findFirst({
      where: {
        id: registrationId,
        eventId,
      },
    });

    if (participation) {
      await prisma.participation.delete({
        where: { id: participation.id },
      });

      console.log(
        `Admin ${user.id} deleted participation ${participation.id} (status: ${participation.status}) for event ${eventId}`
      );

      return NextResponse.json(
        { deleted: true, type: "participation" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
