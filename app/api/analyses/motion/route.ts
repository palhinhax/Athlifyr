/**
 * POST /api/analyses/motion
 *
 * Save a motion (pose) analysis to the database.
 * Can either upload a video to B2 OR use an existing video URL from processing.
 *
 * Requires authentication (Bearer JWT or NextAuth session).
 *
 * Body: multipart/form-data
 *   - localId      : string  — device-generated UUID (idempotency key)
 *   - label        : string? — optional user label
 *
 * Video source (one required):
 *   - video        : file (video/mp4 | video/quicktime | video/webm)  ≤ 200MB
 *   - videoUrl     : string — existing video URL (e.g., from processing API)
 *
 * Mode 1 (web upload — full proxy response):
 *   - analysisData : JSON — full MotionAnalysisProcessResponse (includes skeletonFrames)
 *
 * Mode 2 (legacy / mobile — individual fields):
 *   - segment      : JSON { startMs, endMs }
 *   - sampleFps    : string (number)
 *   - videoMeta    : JSON { videoWidth, videoHeight }
 *   - poseFrames   : JSON PoseFrame[]
 *   - metrics      : JSON PoseMetrics
 *
 * Response 201: { id, videoUrl, createdAt }
 * Response 400: { error }
 * Response 401: { error: "Unauthorized" }
 * Response 409: { id, videoUrl, createdAt } — already saved (idempotent)
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { uploadToB2, deleteFromB2ByName } from "@/lib/b2-storage";
import { remuxMp4Faststart } from "@/lib/ffmpeg-utils";
import { MAX_FILE_BYTES } from "@/lib/video-limits";

export const dynamic = "force-dynamic";
// Allow large video uploads (200 MB)
export const maxDuration = 120;

// ─── Helper functions ───────────────────────────────────────────────────────

async function resolveVideoSource(
  videoFile: FormDataEntryValue | null,
  videoUrlParam: FormDataEntryValue | null,
  localId: string
): Promise<NextResponse | { finalVideoUrl: string; videoB2Key: string }> {
  if (
    videoUrlParam &&
    typeof videoUrlParam === "string" &&
    videoUrlParam.startsWith("http")
  ) {
    const isAlreadyOnB2 = videoUrlParam.includes("backblazeb2.com/file/");

    if (isAlreadyOnB2) {
      const fileMatch = videoUrlParam.match(/\/file\/[^/]+\/(.+)$/);
      console.log(
        `[MotionAnalysis] Video already on B2, skipping download: ${videoUrlParam}`
      );
      return {
        finalVideoUrl: videoUrlParam,
        videoB2Key: fileMatch ? fileMatch[1] : videoUrlParam,
      };
    }

    return downloadAndUploadToB2(videoUrlParam, localId);
  }

  if (videoFile && videoFile instanceof File) {
    return uploadVideoFileToB2(videoFile, localId);
  }

  return NextResponse.json(
    { error: "Either video file or videoUrl is required" },
    { status: 400 }
  );
}

async function downloadAndUploadToB2(
  videoUrlParam: string,
  localId: string
): Promise<NextResponse | { finalVideoUrl: string; videoB2Key: string }> {
  try {
    console.log(`[MotionAnalysis] Downloading video from: ${videoUrlParam}`);
    const videoResponse = await fetch(videoUrlParam);
    if (!videoResponse.ok) {
      return NextResponse.json(
        { error: `Failed to download video: ${videoResponse.status}` },
        { status: 400 }
      );
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    console.log(
      `[MotionAnalysis] Downloaded ${videoBuffer.length} bytes, applying faststart...`
    );

    let uploadBuffer: Buffer = videoBuffer;
    try {
      uploadBuffer = await remuxMp4Faststart(videoBuffer);
    } catch (remuxErr) {
      console.warn(
        "[MotionAnalysis] ffmpeg remux failed, uploading original:",
        remuxErr
      );
    }

    const uploadResult = await uploadToB2({
      file: uploadBuffer,
      fileName: `motion_${localId}.mp4`,
      contentType: "video/mp4",
      folder: "analyses",
    });

    console.log(`[MotionAnalysis] Uploaded to B2: ${uploadResult.url}`);
    return {
      finalVideoUrl: uploadResult.url,
      videoB2Key: uploadResult.fileName,
    };
  } catch (error) {
    console.error("[MotionAnalysis] Error downloading/uploading video:", error);
    return NextResponse.json(
      { error: "Failed to download and store processed video" },
      { status: 500 }
    );
  }
}

async function uploadVideoFileToB2(
  videoFile: File,
  localId: string
): Promise<NextResponse | { finalVideoUrl: string; videoB2Key: string }> {
  const baseType = videoFile.type.split(";")[0].trim();
  const allowedTypes = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-msvideo",
    "video/x-matroska",
  ];
  if (!allowedTypes.includes(baseType)) {
    return NextResponse.json(
      { error: "Only mp4, mov, avi, mkv, and webm videos are supported" },
      { status: 400 }
    );
  }
  if (videoFile.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "Video exceeds 200 MB limit" },
      { status: 400 }
    );
  }

  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

  let uploadBuffer: Buffer = videoBuffer;
  try {
    uploadBuffer = await remuxMp4Faststart(videoBuffer);
  } catch (remuxErr) {
    console.warn(
      "[MotionAnalysis] ffmpeg remux failed on direct upload, using original:",
      remuxErr
    );
  }

  const uploadResult = await uploadToB2({
    file: uploadBuffer,
    fileName: `motion_${localId}.mp4`,
    contentType: videoFile.type || "video/mp4",
    folder: "analyses",
  });

  return {
    finalVideoUrl: uploadResult.url,
    videoB2Key: uploadResult.fileName,
  };
}

function parseLegacyAnalysisFields(
  formData: FormData
): NextResponse | Prisma.InputJsonValue {
  const segmentRaw = formData.get("segment");
  const sampleFpsRaw = formData.get("sampleFps");
  const videoMetaRaw = formData.get("videoMeta");
  const poseFramesRaw = formData.get("poseFrames");
  const metricsRaw = formData.get("metrics");

  for (const [key, value] of [
    ["segment", segmentRaw],
    ["sampleFps", sampleFpsRaw],
    ["poseFrames", poseFramesRaw],
    ["metrics", metricsRaw],
  ] as [string, FormDataEntryValue | null][]) {
    if (!value) {
      return NextResponse.json(
        { error: `${key} is required` },
        { status: 400 }
      );
    }
  }

  let segment: Prisma.InputJsonValue,
    videoMeta: Prisma.InputJsonValue | null,
    poseFrames: Prisma.InputJsonValue,
    metrics: Prisma.InputJsonValue;
  try {
    segment = JSON.parse(segmentRaw as string) as Prisma.InputJsonValue;
    videoMeta = videoMetaRaw
      ? (JSON.parse(videoMetaRaw as string) as Prisma.InputJsonValue)
      : null;
    poseFrames = JSON.parse(poseFramesRaw as string) as Prisma.InputJsonValue;
    metrics = JSON.parse(metricsRaw as string) as Prisma.InputJsonValue;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in one of the fields" },
      { status: 400 }
    );
  }

  const sampleFps = Number(sampleFpsRaw);
  if (!Number.isFinite(sampleFps)) {
    return NextResponse.json({ error: "Invalid sampleFps" }, { status: 400 });
  }

  return { segment, sampleFps, videoMeta, poseFrames, metrics };
}

export async function POST(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse multipart ───────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart body" },
      { status: 400 }
    );
  }

  const localId = formData.get("localId");
  if (!localId || typeof localId !== "string") {
    return NextResponse.json({ error: "localId is required" }, { status: 400 });
  }

  // ── Idempotency check ──────────────────────────────────────────────────────
  const existing = await prisma.motionAnalysisRecord.findUnique({
    where: { localId },
    select: { id: true, videoUrl: true, createdAt: true },
  });
  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  // ── Get video source (file OR URL) ─────────────────────────────────────────
  const videoResult = await resolveVideoSource(
    formData.get("video"),
    formData.get("videoUrl"),
    localId
  );
  if (videoResult instanceof NextResponse) return videoResult;
  const { finalVideoUrl, videoB2Key } = videoResult;

  // ── Parse JSON fields ──────────────────────────────────────────────────────
  const label = formData.get("label");

  const analysisDataRaw = formData.get("analysisData");
  let analysisJson: Prisma.InputJsonValue;

  if (analysisDataRaw && typeof analysisDataRaw === "string") {
    try {
      analysisJson = JSON.parse(analysisDataRaw) as Prisma.InputJsonValue;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in analysisData" },
        { status: 400 }
      );
    }
  } else {
    const legacyResult = parseLegacyAnalysisFields(formData);
    if (legacyResult instanceof NextResponse) return legacyResult;
    analysisJson = legacyResult;
  }

  // ── Save to DB ────────────────────────────────────────────────────────────
  const record = await prisma.motionAnalysisRecord.create({
    data: {
      userId: user.id,
      localId,
      label: typeof label === "string" && label.trim() ? label.trim() : null,
      videoUrl: finalVideoUrl,
      videoB2Key: videoB2Key,
      analysisJson,
    },
    select: { id: true, videoUrl: true, createdAt: true },
  });

  return NextResponse.json(record, { status: 201 });
}

/**
 * GET /api/analyses/motion
 * List the authenticated user's saved motion analyses (newest first).
 * Response 200: { analyses: Array<{ id, localId, label, videoUrl, createdAt }> }
 */
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyses = await prisma.motionAnalysisRecord.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      localId: true,
      label: true,
      videoUrl: true,
      analysisJson: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ analyses });
}

/**
 * DELETE /api/analyses/motion
 * Delete a motion analysis by ID. Removes the record from the DB and the video from B2.
 * Body JSON: { id: string }
 * Response 200: { success: true }
 * Response 400: { error }
 * Response 401: { error: "Unauthorized" }
 * Response 404: { error: "Not found" }
 */
export async function DELETE(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // Find the record — must belong to the authenticated user
  const record = await prisma.motionAnalysisRecord.findUnique({
    where: { id },
    select: { id: true, userId: true, videoB2Key: true },
  });

  if (!record || record.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete video from B2 (best-effort — don't block DB deletion)
  if (record.videoB2Key) {
    try {
      await deleteFromB2ByName(record.videoB2Key);
    } catch (err) {
      console.error(
        `[MotionAnalysis] Failed to delete B2 file ${record.videoB2Key}:`,
        err
      );
    }
  }

  // Delete DB record
  await prisma.motionAnalysisRecord.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
