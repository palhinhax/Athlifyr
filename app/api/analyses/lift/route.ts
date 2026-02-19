/**
 * POST /api/analyses/lift
 *
 * Save a lift (bar path) analysis to the database.
 * Uploads the video to B2 "analyses" folder and stores the JSON data in the DB.
 *
 * Requires authentication (Bearer JWT or NextAuth session).
 *
 * Body: multipart/form-data
 *   - video        : file (video/mp4 | video/quicktime | video/webm)  ≤ 200MB
 *   - localId      : string  — device-generated UUID (idempotency key)
 *   - label        : string? — optional user label
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
import { uploadToB2 } from "@/lib/b2-storage";

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

  // ── Validate video ──────────────────────────────────────────────────────────
  const videoFile = formData.get("video");
  if (!videoFile || !(videoFile instanceof File)) {
    return NextResponse.json(
      { error: "video file is required" },
      { status: 400 }
    );
  }

  const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
  if (!allowedTypes.includes(videoFile.type)) {
    return NextResponse.json(
      { error: "Only mp4, mov, and webm videos are supported" },
      { status: 400 }
    );
  }

  const maxBytes = 200 * 1024 * 1024; // 200 MB
  if (videoFile.size > maxBytes) {
    return NextResponse.json(
      { error: "Video exceeds 200 MB limit" },
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

  // ── Upload video to B2 ────────────────────────────────────────────────────
  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
  const uploadResult = await uploadToB2({
    file: videoBuffer,
    fileName: `lift_${localId}.mp4`,
    contentType: videoFile.type || "video/mp4",
    folder: "analyses",
  });

  // ── Save to DB ────────────────────────────────────────────────────────────
  const record = await prisma.liftAnalysisRecord.create({
    data: {
      userId: user.id,
      localId,
      label: typeof label === "string" && label.trim() ? label.trim() : null,
      videoUrl: uploadResult.url,
      videoB2Key: uploadResult.fileName,
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
