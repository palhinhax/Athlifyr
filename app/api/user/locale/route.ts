import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { locale } = await req.json();

    // Validate locale
    if (!locale || !["pt", "en"].includes(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    // Update user's locale preference
    await prisma.user.update({
      where: { id: session.user.id },
      data: { locale },
    });

    return NextResponse.json({ success: true, locale });
  } catch (error) {
    console.error("Error updating user locale:", error);
    return NextResponse.json(
      { error: "Failed to update locale" },
      { status: 500 }
    );
  }
}
