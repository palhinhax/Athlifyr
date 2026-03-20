/**
 * POST /api/analyses/lift
 *
 * Save a lift (bar path) analysis to the database.
 * Can upload a video to B2 OR use an existing video URL from processing.
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
 *   - analysisData : JSON — full LiftAnalysisProcessResponse (includes skeletonFrames)
 *
 * Mode 2 (legacy / mobile — individual fields):
 *   - durationMs   : string (number)
 *   - fpsSample    : string (number)
 *   - seedPoint    : JSON { x, y }
 *   - barPath      : JSON BarPathPoint[]
 *   - metrics      : JSON LiftMetrics
 *
 * Response 201: { id, videoUrl, createdAt }
 * Response 400: { error }
 * Response 401: { error: "Unauthorized" }
 * Response 200: { id, videoUrl, createdAt } — already saved (idempotent)
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { uploadToB2, deleteFromB2ByName } from "@/lib/b2-storage";
import { remuxMp4Faststart } from "@/lib/ffmpeg-utils";
import { MAX_FILE_BYTES } from "@/lib/video-limits";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface VideoResult {
  url: string;
  b2Key: string | null;
}

async function resolveVideoFromUrl(
  videoUrl: string,
  localId: string
): Promise<VideoResult | NextResponse> {
  const isAlreadyOnB2 = videoUrl.includes("backblazeb2.com/file/");

  if (isAlreadyOnB2) {
    const fileMatch = /\/file\/[^/]+\/(.+)$/.exec(videoUrl);
    console.log(
      `[LiftAnalysis] Video already on B2, skipping download: ${videoUrl}`
    );
    return { url: videoUrl, b2Key: fileMatch ? fileMatch[1] : videoUrl };
  }

  try {
    console.log(`[LiftAnalysis] Downloading video from: ${videoUrl}`);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      return NextResponse.json(
        { error: `Failed to download video: ${videoResponse.status}` },
        { status: 400 }
      );
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    console.log(
      `[LiftAnalysis] Downloaded ${videoBuffer.length} bytes, applying faststart...`
    );

    let uploadBuffer: Buffer = videoBuffer;
    try {
      uploadBuffer = await remuxMp4Faststart(videoBuffer);
    } catch (remuxErr) {
      console.warn(
        "[LiftAnalysis] ffmpeg remux failed, uploading original:",
        remuxErr
      );
    }

    const uploadResult = await uploadToB2({
      file: uploadBuffer,
      fileName: `lift_${localId}.mp4`,
      contentType: "video/mp4",
      folder: "analyses",
    });

    console.log(`[LiftAnalysis] Uploaded to B2: ${uploadResult.url}`);
    return { url: uploadResult.url, b2Key: uploadResult.fileName };
  } catch (error) {
    console.error("[LiftAnalysis] Error downloading/uploading video:", error);
    return NextResponse.json(
      { error: "Failed to download and store processed video" },
      { status: 500 }
    );
  }
}

async function resolveVideoFromFile(
  videoFile: File,
  localId: string
): Promise<VideoResult | NextResponse> {
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
      { error: "Video exceeds 100 MB limit" },
      { status: 400 }
    );
  }

  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

  let uploadBuffer: Buffer = videoBuffer;
  try {
    uploadBuffer = await remuxMp4Faststart(videoBuffer);
  } catch (remuxErr) {
    console.warn(
      "[LiftAnalysis] ffmpeg remux failed on direct upload, using original:",
      remuxErr
    );
  }

  const uploadResult = await uploadToB2({
    file: uploadBuffer,
    fileName: `lift_${localId}.mp4`,
    contentType: videoFile.type || "video/mp4",
    folder: "analyses",
  });

  return { url: uploadResult.url, b2Key: uploadResult.fileName };
}

function parseAnalysisJson(
  formData: FormData
): Prisma.InputJsonValue | NextResponse {
  const analysisDataRaw = formData.get("analysisData");

  if (analysisDataRaw && typeof analysisDataRaw === "string") {
    try {
      return JSON.parse(analysisDataRaw) as Prisma.InputJsonValue;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in analysisData" },
        { status: 400 }
      );
    }
  }

  const durationMsRaw = formData.get("durationMs");
  const fpsSampleRaw = formData.get("fpsSample");
  const seedPointRaw = formData.get("seedPoint");
  const barPathRaw = formData.get("barPath");
  const metricsRaw = formData.get("metrics");

  for (const [key, value] of [
    ["durationMs", durationMsRaw],
    ["fpsSample", fpsSampleRaw],
    ["seedPoint", seedPointRaw],
    ["barPath", barPathRaw],
    ["metrics", metricsRaw],
  ] as [string, FormDataEntryValue | null][]) {
    if (!value) {
      return NextResponse.json(
        { error: `${key} is required` },
        { status: 400 }
      );
    }
  }

  let seedPoint: Prisma.InputJsonValue,
    barPath: Prisma.InputJsonValue,
    metrics: Prisma.InputJsonValue;
  try {
    seedPoint = JSON.parse(seedPointRaw as string) as Prisma.InputJsonValue;
    barPath = JSON.parse(barPathRaw as string) as Prisma.InputJsonValue;
    metrics = JSON.parse(metricsRaw as string) as Prisma.InputJsonValue;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in one of the fields" },
      { status: 400 }
    );
  }

  const durationMs = Number(durationMsRaw);
  const fpsSample = Number(fpsSampleRaw);
  if (!Number.isFinite(durationMs) || !Number.isFinite(fpsSample)) {
    return NextResponse.json(
      { error: "Invalid durationMs or fpsSample" },
      { status: 400 }
    );
  }

  return { durationMs, fpsSample, seedPoint, barPath, metrics };
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
  const existing = await prisma.liftAnalysisRecord.findUnique({
    where: { localId },
    select: { id: true, videoUrl: true, createdAt: true },
  });
  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  // ── Get video source (file OR URL) ─────────────────────────────────────────
  const videoFile = formData.get("video");
  const videoUrlParam = formData.get("videoUrl");

  let videoResult: VideoResult | NextResponse;

  if (
    videoUrlParam &&
    typeof videoUrlParam === "string" &&
    videoUrlParam.startsWith("http")
  ) {
    videoResult = await resolveVideoFromUrl(videoUrlParam, localId);
  } else if (videoFile && videoFile instanceof File) {
    videoResult = await resolveVideoFromFile(videoFile, localId);
  } else {
    return NextResponse.json(
      { error: "Either video file or videoUrl is required" },
      { status: 400 }
    );
  }

  if (videoResult instanceof NextResponse) return videoResult;

  // ── Parse JSON fields ──────────────────────────────────────────────────────
  const label = formData.get("label");
  const analysisJson = parseAnalysisJson(formData);
  if (analysisJson instanceof NextResponse) return analysisJson;

  // ── Save to DB ────────────────────────────────────────────────────────────
  const record = await prisma.liftAnalysisRecord.create({
    data: {
      userId: user.id,
      localId,
      label: typeof label === "string" && label.trim() ? label.trim() : null,
      videoUrl: videoResult.url,
      videoB2Key: videoResult.b2Key ?? "",
      analysisJson,
    },
    select: { id: true, videoUrl: true, createdAt: true },
  });

  return NextResponse.json(record, { status: 201 });
}

/**
 * GET /api/analyses/lift
 * List the authenticated user's saved lift analyses (newest first).
 * Response 200: { analyses: Array<{ id, localId, label, videoUrl, createdAt }> }
 */
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyses = await prisma.liftAnalysisRecord.findMany({
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
 * DELETE /api/analyses/lift
 * Delete a lift analysis by ID. Removes the record from the DB and the video from B2.
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
  const record = await prisma.liftAnalysisRecord.findUnique({
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
        `[LiftAnalysis] Failed to delete B2 file ${record.videoB2Key}:`,
        err
      );
    }
  }

  // Delete DB record
  await prisma.liftAnalysisRecord.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
