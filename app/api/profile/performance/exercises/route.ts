import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

// GET /api/profile/performance/exercises - Search exercises
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    // Search for exercises by name (fuzzy match using contains)
    // Include global exercises and user's own exercises
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [{ isGlobal: true }, { createdById: session.user.id }],
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { aliases: { has: query.toLowerCase() } },
          ],
        }),
      },
      orderBy: [
        { isGlobal: "desc" }, // Global exercises first
        { name: "asc" },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        isGlobal: true,
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error searching exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/profile/performance/exercises - Create a new exercise
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only pro users and admins can create exercises
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isProAccount: true, role: true },
    });

    if (user?.role !== "ADMIN" && !user?.isProAccount) {
      return NextResponse.json(
        { error: "Pro account required to create exercises" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = createExerciseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;

    // Check if a global exercise with similar name already exists
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        isGlobal: true,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existingExercise) {
      return NextResponse.json(existingExercise);
    }

    // Check if user already has an exercise with this name
    const existingUserExercise = await prisma.exercise.findFirst({
      where: {
        createdById: session.user.id,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existingUserExercise) {
      return NextResponse.json(existingUserExercise);
    }

    // Create new user-specific exercise
    const exercise = await prisma.exercise.create({
      data: {
        name: name.trim(),
        createdById: session.user.id,
        isGlobal: false,
        category: "OTHER",
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
