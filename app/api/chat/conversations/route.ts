import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET - List conversations for authenticated user
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
            hidden: false,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create or get existing 1:1 conversation
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json(
        { error: "Other user ID is required" },
        { status: 400 }
      );
    }

    if (otherUserId === user.id) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use a serializable transaction to prevent race conditions
    // This ensures only one conversation is created between two users
    const result = await prisma.$transaction(
      async (tx) => {
        // Check if conversation already exists between these two users
        const existingConversation = await tx.conversation.findFirst({
          where: {
            AND: [
              {
                participants: {
                  some: {
                    userId: user.id,
                  },
                },
              },
              {
                participants: {
                  some: {
                    userId: otherUserId,
                  },
                },
              },
            ],
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        });

        if (existingConversation) {
          return { conversation: existingConversation, isNew: false };
        }

        // Create new conversation with both participants
        const conversation = await tx.conversation.create({
          data: {
            participants: {
              create: [{ userId: user.id }, { userId: otherUserId }],
            },
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                  },
                },
              },
            },
            messages: true,
          },
        });

        return { conversation, isNew: true };
      },
      {
        isolationLevel: "Serializable", // Prevents race conditions
        maxWait: 5000, // Maximum time to wait to acquire a transaction slot
        timeout: 10000, // Maximum time the transaction can run
      }
    );

    return NextResponse.json(
      { conversation: result.conversation },
      { status: result.isNew ? 201 : 200 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
