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

  let finalVideoUrl: string;
  let videoB2Key: string | null = null;

  if (
    videoUrlParam &&
    typeof videoUrlParam === "string" &&
    videoUrlParam.startsWith("http")
  ) {
    // Download video from external URL and upload to B2
    try {
      console.log(`[LiftAnalysis] Downloading video from: ${videoUrlParam}`);
      const videoResponse = await fetch(videoUrlParam);
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

      // API already returns H.264 — just remux to move moov atom to start
      // so browsers can determine duration instantly without buffering the whole file.
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

      finalVideoUrl = uploadResult.url;
      videoB2Key = uploadResult.fileName;
      console.log(`[LiftAnalysis] Uploaded to B2: ${finalVideoUrl}`);
    } catch (error) {
      console.error("[LiftAnalysis] Error downloading/uploading video:", error);
      return NextResponse.json(
        { error: "Failed to download and store processed video" },
        { status: 500 }
      );
    }
  } else if (videoFile && videoFile instanceof File) {
    // Upload video file to B2
    // Match on the base MIME type (before any codec params like "video/webm;codecs=vp9")
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

    const maxBytes = MAX_FILE_BYTES; // 100 MB
    if (videoFile.size > maxBytes) {
      return NextResponse.json(
        { error: "Video exceeds 100 MB limit" },
        { status: 400 }
      );
    }

    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    // Remux to ensure moov atom is at start for instant browser playback
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

    finalVideoUrl = uploadResult.url;
    videoB2Key = uploadResult.fileName;
  } else {
    return NextResponse.json(
      { error: "Either video file or videoUrl is required" },
      { status: 400 }
    );
  }

  // ── Parse JSON fields ──────────────────────────────────────────────────────
  const label = formData.get("label");

  // Support two modes:
  // 1. `analysisData` — full proxy response JSON (used by web upload)
  // 2. Individual fields — legacy format (used by mobile)
  const analysisDataRaw = formData.get("analysisData");
  let analysisJson: Prisma.InputJsonValue;

  if (analysisDataRaw && typeof analysisDataRaw === "string") {
    // ── Mode 1: Full analysis response ────────────────────────────────────
    try {
      analysisJson = JSON.parse(analysisDataRaw) as Prisma.InputJsonValue;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in analysisData" },
        { status: 400 }
      );
    }
  } else {
    // ── Mode 2: Individual fields (backward compatible) ──────────────────
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

    analysisJson = { durationMs, fpsSample, seedPoint, barPath, metrics };
  }

  // ── Save to DB ────────────────────────────────────────────────────────────
  const record = await prisma.liftAnalysisRecord.create({
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
