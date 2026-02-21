/**
 * Backblaze B2 — S3-compatible client for presigned URLs.
 *
 * Uses the AWS S3 SDK (v3) against Backblaze's S3-compatible endpoint
 * to generate presigned PUT URLs that let clients upload files directly
 * to B2 without routing through Vercel (which has a 4.5 MB body limit).
 *
 * Required env vars (set in Vercel + .env.local):
 *   B2_S3_ENDPOINT       — e.g. "https://s3.us-east-005.backblazeb2.com"
 *   B2_S3_REGION         — e.g. "us-east-005"
 *   B2_S3_ACCESS_KEY_ID  — your B2 keyID
 *   B2_S3_SECRET_ACCESS_KEY — your B2 applicationKey
 *   B2_VIDEO_BUCKET_NAME — e.g. "athlifyr-videos"
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// ── Singleton S3 client ───────────────────────────────────────────────────

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  const endpoint = process.env.B2_S3_ENDPOINT;
  const region = process.env.B2_S3_REGION;
  const accessKeyId = process.env.B2_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.B2_S3_SECRET_ACCESS_KEY;

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing B2 S3 env vars: B2_S3_ENDPOINT, B2_S3_REGION, B2_S3_ACCESS_KEY_ID, B2_S3_SECRET_ACCESS_KEY"
    );
  }

  s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // Required for B2 S3 compatibility
  });

  return s3Client;
}

// ── Public helpers ────────────────────────────────────────────────────────

export interface PresignUploadResult {
  /** Presigned PUT URL — client uploads raw bytes here */
  uploadUrl: string;
  /** Object key in the bucket (e.g. "uploads/<userId>/<uuid>.mp4") */
  key: string;
  /** URL expiry in seconds */
  expiresIn: number;
}

/**
 * Generate a presigned PUT URL so the client can upload a video
 * directly to Backblaze B2 without going through Vercel.
 *
 * @param userId      Authenticated user ID (used as folder prefix)
 * @param contentType MIME type (e.g. "video/mp4")
 * @param fileExt     File extension without dot (e.g. "mp4")
 * @param expiresIn   Seconds until the URL expires (default 300 = 5 min)
 */
export async function createPresignedUploadUrl(
  userId: string,
  contentType: string,
  fileExt: string,
  expiresIn: number = 300
): Promise<PresignUploadResult> {
  const client = getS3Client();
  const bucket = process.env.B2_VIDEO_BUCKET_NAME;

  if (!bucket) {
    throw new Error("B2_VIDEO_BUCKET_NAME env var is not set");
  }

  // Build a unique key: uploads/<userId>/<uuid>.<ext>
  const key = `uploads/${userId}/${randomUUID()}.${fileExt.replace(/^\./, "")}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

  return { uploadUrl, key, expiresIn };
}

/**
 * Generate a presigned GET URL so the server / Railway worker can
 * download a video from B2 for processing.
 *
 * @param key       Object key in the bucket
 * @param expiresIn Seconds until the URL expires (default 600 = 10 min)
 */
export async function createPresignedDownloadUrl(
  key: string,
  expiresIn: number = 600
): Promise<string> {
  const client = getS3Client();
  const bucket = process.env.B2_VIDEO_BUCKET_NAME;

  if (!bucket) {
    throw new Error("B2_VIDEO_BUCKET_NAME env var is not set");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Generate a presigned PUT URL so Railway can upload the **processed**
 * (output) video directly to B2 after analysis.
 *
 * The key follows the pattern: `results/<userId>/<uuid>.mp4`
 *
 * @param userId    Authenticated user ID (folder prefix)
 * @param expiresIn Seconds until the URL expires (default 900 = 15 min)
 * @returns         `{ uploadUrl, key }` — Railway PUTs the file, Vercel stores the key
 */
export async function createPresignedResultUploadUrl(
  userId: string,
  expiresIn: number = 900
): Promise<{ uploadUrl: string; key: string }> {
  const client = getS3Client();
  const bucket = process.env.B2_VIDEO_BUCKET_NAME;

  if (!bucket) {
    throw new Error("B2_VIDEO_BUCKET_NAME env var is not set");
  }

  const key = `results/${userId}/${randomUUID()}.mp4`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: "video/mp4",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

  return { uploadUrl, key };
}

/**
 * Build the **public** B2 URL for a given object key.
 *
 * Backblaze public URL format:
 *   https://f005.backblazeb2.com/file/<bucketName>/<key>
 *
 * This only works if the bucket is public or the file is set to public.
 * For private buckets, use `createPresignedDownloadUrl` instead.
 */
export function getB2PublicUrl(key: string): string {
  const bucketUrl = process.env.NEXT_PUBLIC_B2_BUCKET_URL;
  const bucket = process.env.B2_VIDEO_BUCKET_NAME;

  if (!bucketUrl || !bucket) {
    throw new Error(
      "Missing NEXT_PUBLIC_B2_BUCKET_URL or B2_VIDEO_BUCKET_NAME"
    );
  }

  // NEXT_PUBLIC_B2_BUCKET_URL is already the public base, e.g. "https://f003.backblazeb2.com"
  // Public file URL format: https://f003.backblazeb2.com/file/<bucket>/<key>
  return `${bucketUrl}/file/${bucket}/${key}`;
}
