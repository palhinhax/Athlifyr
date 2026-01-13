import B2 from "backblaze-b2";

// Singleton B2 client
let b2Client: B2 | null = null;
let authToken: string | null = null;
let authExpiry: number = 0;

async function getB2Client(): Promise<B2> {
  if (!b2Client) {
    b2Client = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
      applicationKey: process.env.B2_APPLICATION_KEY!,
    });
  }

  // Check if we need to re-authorize
  const now = Date.now();
  if (!authToken || now >= authExpiry) {
    const authResponse = await b2Client.authorize();
    authToken = authResponse.data.authorizationToken;
    // Set expiry to 23 hours from now (tokens last 24 hours)
    authExpiry = now + 23 * 60 * 60 * 1000;
  }

  return b2Client;
}

export interface UploadOptions {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: "profiles" | "posts" | "events";
}

export interface UploadResult {
  fileId: string;
  fileName: string;
  url: string;
  contentType: string;
  contentLength: number;
}

/**
 * Upload a file to Backblaze B2
 * @param options Upload options including file buffer, name, and content type
 * @returns Upload result with file URL
 */
export async function uploadToB2({
  file,
  fileName,
  contentType,
  folder = "posts",
}: UploadOptions): Promise<UploadResult> {
  try {
    const b2 = await getB2Client();
    const bucketId = process.env.B2_BUCKET_ID;

    if (!bucketId) {
      throw new Error("B2_BUCKET_ID environment variable is not set");
    }

    // Generate a unique file name with folder prefix
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fullFileName = `${folder}/${timestamp}_${sanitizedFileName}`;

    // Get upload URL
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId,
    });

    // Upload file
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: fullFileName,
      data: file,
      contentType,
    });

    // Construct public URL
    // The friendly URL format is: https://f003.backblazeb2.com/file/{bucket-name}/{file-name}
    const bucketName = process.env.B2_BUCKET_NAME;
    const bucketUrl = process.env.NEXT_PUBLIC_B2_BUCKET_URL;

    // ALWAYS use the correct URL format - never fallback to bucket ID
    const finalBucketUrl =
      bucketUrl && bucketUrl.includes("f003")
        ? bucketUrl
        : "https://f003.backblazeb2.com";

    const fileUrl = `${finalBucketUrl}/file/${bucketName}/${fullFileName}`;

    return {
      fileId: uploadResponse.data.fileId,
      fileName: fullFileName,
      url: fileUrl,
      contentType,
      contentLength: file.length,
    };
  } catch (error) {
    console.error("Error uploading to B2:", error);
    throw new Error(
      `Failed to upload file to B2: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Delete a file from Backblaze B2
 * @param fileName The full file name (including folder prefix)
 * @param fileId The B2 file ID
 */
export async function deleteFromB2(
  fileName: string,
  fileId: string
): Promise<void> {
  try {
    const b2 = await getB2Client();

    await b2.deleteFileVersion({
      fileName,
      fileId,
    });
  } catch (error) {
    console.error("Error deleting from B2:", error);
    throw new Error(
      `Failed to delete file from B2: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Validate image file type and size
 * @param file File buffer
 * @param contentType MIME type
 * @param maxSizeMB Maximum file size in MB (default: 5MB)
 */
export function validateImage(
  file: Buffer,
  contentType: string,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.length > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check content type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed",
    };
  }

  return { valid: true };
}
