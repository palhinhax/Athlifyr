import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/data-export
 * Export all user data (GDPR - Right to Data Portability)
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
        postLikes: true,
        postComments: true,
        comments: true,
        participations: {
          include: {
            event: {
              select: {
                title: true,
                slug: true,
                startDate: true,
                endDate: true,
              },
            },
            variant: {
              select: {
                name: true,
              },
            },
          },
        },
        photos: true,
        sentFriendships: {
          where: { status: "ACCEPTED" },
          include: {
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        receivedFriendships: {
          where: { status: "ACCEPTED" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const totalFriends =
      userData.sentFriendships.length + userData.receivedFriendships.length;

    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: "GDPR Data Export",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        locale: userData.locale,
        favoriteSports: userData.favoriteSports,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      posts: userData.posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        commentsCount: post.comments.length,
      })),
      postComments: userData.postComments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        postId: comment.postId,
      })),
      eventComments: userData.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        eventId: comment.eventId,
      })),
      eventParticipations: userData.participations.map((p) => ({
        eventTitle: p.event.title,
        eventSlug: p.event.slug,
        eventStartDate: p.event.startDate,
        eventEndDate: p.event.endDate,
        variantName: p.variant?.name || null,
        status: p.status,
        registeredAt: p.createdAt,
      })),
      photos: userData.photos.map((photo) => ({
        id: photo.id,
        caption: photo.caption,
        imageUrl: photo.imageUrl,
        createdAt: photo.createdAt,
      })),
      friends: [
        ...userData.sentFriendships.map((f) => ({
          id: f.receiver.id,
          name: f.receiver.name,
          email: f.receiver.email,
        })),
        ...userData.receivedFriendships.map((f) => ({
          id: f.sender.id,
          name: f.sender.name,
          email: f.sender.email,
        })),
      ],
      stats: {
        totalPosts: userData.posts.length,
        totalPostComments: userData.postComments.length,
        totalEventComments: userData.comments.length,
        totalPostLikes: userData.postLikes.length,
        totalEventParticipations: userData.participations.length,
        totalPhotos: userData.photos.length,
        totalFriends,
      },
    };

    // Return as JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="athlifyr-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
