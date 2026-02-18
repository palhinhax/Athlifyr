import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { uploadToB2, validateFile } from "@/lib/b2-storage";
import {
  optimizeProfileImage,
  optimizeEventImage,
  optimizePostImage,
  optimizeImage,
} from "@/lib/image-optimizer";
import type { OptimizeImageResult } from "@/lib/image-optimizer";

/** Select optimization strategy based on upload folder */
function optimizeByFolder(
  buffer: Buffer,
  contentType: string,
  folder: string
): Promise<OptimizeImageResult> {
  switch (folder) {
    case "profiles":
      return optimizeProfileImage(buffer, contentType);
    case "events":
      return optimizeEventImage(buffer, contentType);
    case "posts":
      return optimizePostImage(buffer, contentType);
    case "instagram":
      return optimizeImage({
        buffer,
        contentType,
        maxWidth: 1080,
        maxHeight: 1080,
        quality: 90,
      });
    default:
      return optimizePostImage(buffer, contentType);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) || "posts";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate folder
    const allowedFolders = [
      "profiles",
      "posts",
      "events",
      "instagram",
      "exports",
    ];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine max file size based on user role and file type
    // Videos can be larger: Admins up to 100MB, regular users up to 50MB
    // Images: Admins up to 20MB, regular users up to 5MB
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    const maxSizeMB =
      user.role === "ADMIN" ? (isVideo ? 100 : 20) : isVideo ? 50 : 5;

    // Validate file (image or video)
    const validation = validateFile(buffer, file.type, maxSizeMB);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Optimize images before upload (skip videos)
    let uploadBuffer: Buffer<ArrayBuffer> = buffer;
    let uploadContentType = file.type;
    let uploadFileName = file.name;

    if (isImage) {
      const optimized = await optimizeByFolder(buffer, file.type, folder);
      uploadBuffer = Buffer.from(optimized.buffer);
      uploadContentType = optimized.contentType;

      // Update file extension if converted to webp
      if (
        optimized.contentType === "image/webp" &&
        !file.name.endsWith(".webp")
      ) {
        uploadFileName = file.name.replace(/\.[^.]+$/, ".webp");
      }

      if (optimized.savedPercent > 0) {
        console.log(
          `🖼️ Image optimized: ${(optimized.originalSize / 1024).toFixed(0)}KB → ${(optimized.optimizedSize / 1024).toFixed(0)}KB (-${optimized.savedPercent}%)`
        );
      }
    }

    // Upload to B2
    const result = await uploadToB2({
      file: uploadBuffer,
      fileName: uploadFileName,
      contentType: uploadContentType,
      folder: folder as
        | "profiles"
        | "posts"
        | "events"
        | "instagram"
        | "exports",
    });

    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        fileName: result.fileName,
        fileId: result.fileId,
        contentType: result.contentType,
        size: result.contentLength,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const fileId = searchParams.get("fileId");

    if (!fileName || !fileId) {
      return NextResponse.json(
        { error: "fileName and fileId are required" },
        { status: 400 }
      );
    }

    // Note: In production, you should verify the user owns this file
    // before allowing deletion

    const { deleteFromB2 } = await import("@/lib/b2-storage");
    await deleteFromB2(fileName, fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Failed to delete file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
