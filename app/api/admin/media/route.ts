import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listB2Files, getFileFolder, deleteFromB2 } from "@/lib/b2-storage";

interface MediaFile {
  fileId: string;
  fileName: string;
  url: string;
  contentType: string;
  contentLength: number;
  uploadTimestamp: number;
  folder: string;
  isOrphan: boolean;
  usageType?: "post" | "profile" | "event" | "instagram" | "avatar";
  usageId?: string;
  usageTitle?: string;
}

/**
 * GET /api/admin/media
 * List all media files in B2 and identify orphans
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all files from B2
    const b2Files = await listB2Files(1000);

    // Get all image URLs from database
    const [posts, profiles, events, instagramDrafts] = await Promise.all([
      prisma.post.findMany({
        where: {
          imageUrl: {
            not: null,
          },
        },
        select: {
          id: true,
          imageUrl: true,
          content: true,
        },
      }),
      prisma.profilePhoto.findMany({
        select: {
          id: true,
          imageUrl: true,
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.event.findMany({
        where: {
          imageUrl: {
            not: null,
          },
        },
        select: {
          id: true,
          imageUrl: true,
          title: true,
        },
      }),
      prisma.instagramPostDraft.findMany({
        select: {
          id: true,
          payload: true,
          templateKey: true,
        },
      }),
    ]);

    // Also get user profile images
    const users = await prisma.user.findMany({
      where: {
        image: {
          not: null,
        },
      },
      select: {
        id: true,
        image: true,
        name: true,
      },
    });

    // Create a map of all used URLs
    const usedUrls = new Map<
      string,
      {
        type: "post" | "profile" | "event" | "instagram" | "avatar";
        id: string;
        title: string;
      }
    >();

    // Add posts
    posts.forEach((post) => {
      if (post.imageUrl) {
        usedUrls.set(post.imageUrl, {
          type: "post",
          id: post.id,
          title: post.content.substring(0, 50) + "...",
        });
      }
    });

    // Add profile photos
    profiles.forEach((photo) => {
      usedUrls.set(photo.imageUrl, {
        type: "profile",
        id: photo.id,
        title: `${photo.user.name || "Unknown"}'s photo`,
      });
    });

    // Add events
    events.forEach((event) => {
      if (event.imageUrl) {
        usedUrls.set(event.imageUrl, {
          type: "event",
          id: event.id,
          title: event.title,
        });
      }
    });

    // Add Instagram drafts - payload can contain backgroundUrl
    instagramDrafts.forEach((draft) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = draft.payload as any;
      if (payload && payload.backgroundUrl) {
        usedUrls.set(payload.backgroundUrl, {
          type: "instagram",
          id: draft.id,
          title: `Instagram ${draft.templateKey}`,
        });
      }
    });

    // Add user profile images
    users.forEach((user) => {
      if (user.image) {
        usedUrls.set(user.image, {
          type: "avatar",
          id: user.id,
          title: `${user.name || "Unknown"}'s avatar`,
        });
      }
    });

    // Map B2 files to media files with orphan status
    const mediaFiles: MediaFile[] = b2Files.map((file) => {
      const usage = usedUrls.get(file.url);
      const folder = getFileFolder(file.fileName);

      return {
        fileId: file.fileId,
        fileName: file.fileName,
        url: file.url,
        contentType: file.contentType,
        contentLength: file.contentLength,
        uploadTimestamp: file.uploadTimestamp,
        folder,
        isOrphan: !usage,
        usageType: usage?.type,
        usageId: usage?.id,
        usageTitle: usage?.title,
      };
    });

    // Calculate statistics
    const stats = {
      totalFiles: mediaFiles.length,
      totalSize: mediaFiles.reduce((sum, f) => sum + f.contentLength, 0),
      orphanFiles: mediaFiles.filter((f) => f.isOrphan).length,
      orphanSize: mediaFiles
        .filter((f) => f.isOrphan)
        .reduce((sum, f) => sum + f.contentLength, 0),
      byFolder: {} as Record<string, number>,
      byType: {
        post: mediaFiles.filter((f) => f.usageType === "post").length,
        profile: mediaFiles.filter((f) => f.usageType === "profile").length,
        event: mediaFiles.filter((f) => f.usageType === "event").length,
        instagram: mediaFiles.filter((f) => f.usageType === "instagram").length,
        avatar: mediaFiles.filter((f) => f.usageType === "avatar").length,
        orphan: mediaFiles.filter((f) => f.isOrphan).length,
      },
    };

    // Count by folder
    mediaFiles.forEach((file) => {
      stats.byFolder[file.folder] = (stats.byFolder[file.folder] || 0) + 1;
    });

    return NextResponse.json({
      files: mediaFiles,
      stats,
    });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return NextResponse.json(
      { error: "Failed to fetch media files" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media
 * Delete a file from B2 storage
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, fileName } = await request.json();

    if (!fileId || !fileName) {
      return NextResponse.json(
        { error: "fileId and fileName are required" },
        { status: 400 }
      );
    }

    // Delete from B2
    await deleteFromB2(fileName, fileId);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
