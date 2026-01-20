import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    userId: string;
  };
}

/**
 * PATCH /api/admin/users/[userId]/verify
 * Toggle user verification status
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { isVerified } = await request.json();

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "isVerified must be a boolean" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user verification:", error);
    return NextResponse.json(
      { error: "Failed to update user verification" },
      { status: 500 }
    );
  }
}
