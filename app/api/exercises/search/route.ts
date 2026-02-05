import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ exercises: [] });
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        category: true,
      },
      take: 20,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Failed to search exercises:", error);
    return NextResponse.json(
      { error: "Failed to search exercises" },
      { status: 500 }
    );
  }
}
