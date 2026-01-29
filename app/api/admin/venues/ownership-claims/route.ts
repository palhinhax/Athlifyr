import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all ownership claims (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // PENDING, APPROVED, REJECTED

    const claims = await prisma.venueOwnershipClaim.findMany({
      where: status
        ? { status: status as "PENDING" | "APPROVED" | "REJECTED" }
        : undefined,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            country: true,
            type: true,
            logo: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error fetching ownership claims:", error);
    return NextResponse.json(
      { error: "Failed to fetch ownership claims" },
      { status: 500 }
    );
  }
}
