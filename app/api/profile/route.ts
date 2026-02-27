import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireIntegrity } from "@/lib/verify-integrity";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  citizenId: z.string().min(1).max(30).nullable().optional(),
  nationality: z.string().min(1).max(100).nullable().optional(),
  emergencyContactName: z.string().min(1).max(100).nullable().optional(),
  emergencyContactPhone: z.string().min(1).max(30).nullable().optional(),
});

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.image !== undefined && {
          image: validatedData.image,
        }),
        ...(validatedData.dateOfBirth !== undefined && {
          dateOfBirth: validatedData.dateOfBirth
            ? new Date(validatedData.dateOfBirth)
            : null,
        }),
        ...(validatedData.citizenId !== undefined && {
          citizenId: validatedData.citizenId,
        }),
        ...(validatedData.nationality !== undefined && {
          nationality: validatedData.nationality,
        }),
        ...(validatedData.emergencyContactName !== undefined && {
          emergencyContactName: validatedData.emergencyContactName,
        }),
        ...(validatedData.emergencyContactPhone !== undefined && {
          emergencyContactPhone: validatedData.emergencyContactPhone,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dateOfBirth: true,
        citizenId: true,
        nationality: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        dateOfBirth: true,
        citizenId: true,
        nationality: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
