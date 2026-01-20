import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface RouteContext {
  params: {
    userId: string;
  };
}

/**
 * PATCH /api/admin/users/[userId]/role
 * Update user role
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { role } = await request.json();

    if (!role || !["USER", "MOD", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER, MOD, or ADMIN" },
        { status: 400 }
      );
    }

    // Prevent changing own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
