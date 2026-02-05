import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExerciseCategory, Language } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryParam = searchParams.get("category") || "";
    const localeParam = searchParams.get("locale") || "en";

    // Validate locale
    const validLocales: Language[] = ["pt", "en", "es", "fr", "de", "it"];
    const locale = validLocales.includes(localeParam as Language)
      ? (localeParam as Language)
      : "en";

    // Calculate offset
    const skip = (page - 1) * limit;

    // Build where clause with proper typing
    const whereConditions = [];

    // Search condition - search in default name/aliases OR in translations
    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { aliases: { hasSome: [search] } },
          {
            translations: {
              some: {
                OR: [
                  { name: { contains: search, mode: "insensitive" as const } },
                  { aliases: { hasSome: [search] } },
                ],
              },
            },
          },
        ],
      });
    }

    // Category filter
    if (
      categoryParam &&
      Object.values(ExerciseCategory).includes(
        categoryParam as ExerciseCategory
      )
    ) {
      whereConditions.push({ category: categoryParam as ExerciseCategory });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Fetch exercises with pagination
    const [exercises, totalCount] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          translations: {
            where: { language: locale },
          },
        },
      }),
      prisma.exercise.count({ where }),
    ]);

    return NextResponse.json({
      exercises,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
