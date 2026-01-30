import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isProAccount } = await request.json();

    if (typeof isProAccount !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isProAccount value" },
        { status: 400 }
      );
    }

    // Update user pro account settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { isProAccount },
      select: {
        id: true,
        isProAccount: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating pro account settings:", error);
    return NextResponse.json(
      { error: "Failed to update pro account settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        isProAccount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching pro account settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch pro account settings" },
      { status: 500 }
    );
  }
}
