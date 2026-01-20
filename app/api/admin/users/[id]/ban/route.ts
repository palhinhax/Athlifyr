import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    // Prevent banning yourself
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot ban your own account" },
        { status: 400 }
      );
    }

    // Get current user status
    const user = await prisma.user.findUnique({
      where: { id },
      select: { isBanned: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle ban status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isBanned: !user.isBanned },
      select: {
        id: true,
        name: true,
        email: true,
        isBanned: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
