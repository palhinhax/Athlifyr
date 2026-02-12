import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// DELETE - Deactivate a specific push token
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    // Find and deactivate the token (only if it belongs to the user)
    const pushToken = await prisma.pushToken.findUnique({
      where: { token },
    });

    if (!pushToken) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    if (pushToken.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to deactivate this token" },
        { status: 403 }
      );
    }

    await prisma.pushToken.update({
      where: { token },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Token deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating push token:", error);
    return NextResponse.json(
      { error: "Failed to deactivate push token" },
      { status: 500 }
    );
  }
}
