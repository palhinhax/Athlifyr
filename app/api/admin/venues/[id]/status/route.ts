import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Toggle venue active status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error updating venue status:", error);
    return NextResponse.json(
      { error: "Failed to update venue status" },
      { status: 500 }
    );
  }
}
