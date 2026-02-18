/**
 * video-export.ts
 *
 * Server-side video composition engine.
 *
 * Takes an uploaded video + overlay data (motion pose or lift bar path)
 * and renders a composed MP4 with skeleton / bar-path overlay + watermark.
 *
 * Pipeline:
 *   1. ffprobe → get video width, height, fps, duration
 *   2. Extract frames: ffmpeg → frame_%05d.png
 *   3. For each frame, render a transparent overlay PNG (sharp)
 *   4. Compose: ffmpeg overlay filter → output.mp4
 *   5. Upload to B2 → return signed/public URL
 *   6. Cleanup temp files
 */

import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import os from "os";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { uploadToB2 } from "@/lib/b2-storage";

const execFileAsync = promisify(execFile);

// Use bundled binaries — avoids ENOENT when ffmpeg/ffprobe are not in PATH
const FFMPEG_BIN = (ffmpegPath as string | null) ?? "ffmpeg";
const FFPROBE_BIN = ffprobeInstaller.path ?? "ffprobe";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VideoProbeResult {
  width: number;
  height: number;
  fps: number;
  durationMs: number;
}

export interface PoseKeypointData {
  name: string;
  x: number;
  y: number;
  score: number;
}

export interface PoseFrameData {
  t: number;
  keypoints: PoseKeypointData[];
}

export interface MotionOverlayData {
  type: "motion";
  segment: { startMs: number; endMs: number };
  videoMeta: { videoWidth: number; videoHeight: number };
  poseFrames: PoseFrameData[];
  metrics: Record<string, unknown>;
}

export interface LiftOverlayData {
  type: "lift";
  durationMs: number;
  barPath: Array<{ t: number; x: number; y: number }>;
}

export type OverlayData = MotionOverlayData | LiftOverlayData;

export interface ExportJob {
  id: string;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  downloadUrl?: string;
  error?: string;
  createdAt: number;
}

// ── In-memory job store ───────────────────────────────────────────────────────
// In production, replace with Redis or DB-backed storage

const jobs = new Map<string, ExportJob>();
const JOB_TTL_MS = 30 * 60 * 1000; // 30 min

export function createJob(jobId: string): ExportJob {
  const job: ExportJob = {
    id: jobId,
    status: "pending",
    progress: 0,
    createdAt: Date.now(),
  };
  jobs.set(jobId, job);
  return job;
}

export function getJob(jobId: string): ExportJob | undefined {
  return jobs.get(jobId);
}

export function updateJob(jobId: string, update: Partial<ExportJob>): void {
  const job = jobs.get(jobId);
  if (job) {
    Object.assign(job, update);
  }
}

/** Periodically clean up old jobs (call from a timer or on each request) */
export function cleanupJobs(): void {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_TTL_MS) {
      jobs.delete(id);
    }
  }
}

// ── Skeleton definition ───────────────────────────────────────────────────────

const SKELETON_EDGES: [string, string][] = [
  ["nose", "left_shoulder"],
  ["nose", "right_shoulder"],
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

const MIN_KEYPOINT_SCORE = 0.2;

// ── ffprobe ───────────────────────────────────────────────────────────────────

export async function probeVideo(videoPath: string): Promise<VideoProbeResult> {
  const { stdout } = await execFileAsync(FFPROBE_BIN, [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_streams",
    "-show_format",
    videoPath,
  ]);

  const probe = JSON.parse(stdout);
  const videoStream = probe.streams?.find(
    (s: Record<string, string>) => s.codec_type === "video"
  );

  if (!videoStream) {
    throw new Error("No video stream found in file");
  }

  const width = parseInt(videoStream.width, 10);
  const height = parseInt(videoStream.height, 10);

  // Parse fps from r_frame_rate (e.g. "30/1" or "30000/1001")
  let fps = 30;
  if (videoStream.r_frame_rate) {
    const [num, den] = videoStream.r_frame_rate.split("/").map(Number);
    if (num && den) {
      fps = Math.round(num / den);
    }
  }

  // Duration from stream or format
  const durationSec =
    parseFloat(videoStream.duration) || parseFloat(probe.format?.duration) || 0;
  const durationMs = Math.round(durationSec * 1000);

  return { width, height, fps, durationMs };
}

// ── SVG overlay rendering ─────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Render a motion (skeleton) overlay as a transparent PNG buffer */
function renderMotionOverlaySvg(
  frame: PoseFrameData,
  w: number,
  h: number
): string {
  const kpMap = new Map(frame.keypoints.map((kp) => [kp.name, kp]));

  let lines = "";
  for (const [a, b] of SKELETON_EDGES) {
    const ka = kpMap.get(a);
    const kb = kpMap.get(b);
    if (
      !ka ||
      !kb ||
      ka.score < MIN_KEYPOINT_SCORE ||
      kb.score < MIN_KEYPOINT_SCORE
    ) {
      continue;
    }
    const x1 = Math.round(ka.x * w);
    const y1 = Math.round(ka.y * h);
    const x2 = Math.round(kb.x * w);
    const y2 = Math.round(kb.y * h);
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00FF88" stroke-width="4" stroke-linecap="round" opacity="0.85"/>`;
  }

  let circles = "";
  for (const kp of frame.keypoints) {
    if (kp.score < MIN_KEYPOINT_SCORE) continue;
    const cx = Math.round(kp.x * w);
    const cy = Math.round(kp.y * h);
    const r = 6;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#00FF88" stroke-width="2" opacity="0.9"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${lines}${circles}</svg>`;
}

/** Render a lift (bar path) overlay as a transparent PNG buffer */
function renderLiftOverlaySvg(
  barPath: Array<{ t: number; x: number; y: number }>,
  upToTimeMs: number,
  w: number,
  h: number
): string {
  // Only draw points up to the current time
  const pointsUpTo = barPath.filter((p) => p.t <= upToTimeMs);
  if (pointsUpTo.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"></svg>`;
  }

  // Build polyline
  const pointsStr = pointsUpTo
    .map((p) => `${Math.round(p.x * w)},${Math.round(p.y * h)}`)
    .join(" ");

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`;

  // Trail line
  if (pointsUpTo.length >= 2) {
    svg += `<polyline points="${escapeXml(pointsStr)}" fill="none" stroke="#FF6B35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
  }

  // Current position dot
  const last = pointsUpTo[pointsUpTo.length - 1];
  const cx = Math.round(last.x * w);
  const cy = Math.round(last.y * h);
  svg += `<circle cx="${cx}" cy="${cy}" r="10" fill="#FF6B35" stroke="#FFFFFF" stroke-width="3" opacity="1.0"/>`;

  // Start position marker (small)
  const first = pointsUpTo[0];
  const sx = Math.round(first.x * w);
  const sy = Math.round(first.y * h);
  svg += `<circle cx="${sx}" cy="${sy}" r="5" fill="#FFFFFF" stroke="#FF6B35" stroke-width="2" opacity="0.7"/>`;

  svg += `</svg>`;
  return svg;
}

/** Render the "Athlifyr" watermark as SVG */
function renderWatermarkSvg(w: number, h: number): string {
  const fontSize = Math.max(14, Math.round(w * 0.025));
  const x = w - 12;
  const y = h - 12;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" fill-opacity="0.6" text-anchor="end">Athlifyr</text>
  </svg>`;
}

// ── Core processing pipeline ──────────────────────────────────────────────────

/**
 * Find the closest pose frame for a given timestamp
 */
function findClosestFrame(
  frames: PoseFrameData[],
  timeMs: number
): PoseFrameData | null {
  if (frames.length === 0) return null;

  let bestIdx = 0;
  let bestDist = Math.abs(frames[0].t - timeMs);

  for (let i = 1; i < frames.length; i++) {
    const dist = Math.abs(frames[i].t - timeMs);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  return frames[bestIdx];
}

/**
 * processExportJob
 *
 * Main pipeline: extract frames → render overlays → compose → upload → cleanup
 */
export async function processExportJob(
  jobId: string,
  videoBuffer: Buffer,
  overlay: OverlayData
): Promise<void> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "athlifyr-export-"));

  try {
    updateJob(jobId, { status: "processing", progress: 5 });

    // ── 1. Write uploaded video to disk ─────────────────────────
    const inputPath = path.join(tmpDir, "input.mp4");
    await fs.writeFile(inputPath, videoBuffer);

    // ── 2. Probe video ──────────────────────────────────────────
    const probe = await probeVideo(inputPath);
    const { width, height, fps } = probe;

    updateJob(jobId, { progress: 10 });

    // ── 3. Determine segment & output FPS ───────────────────────
    let segmentStartMs = 0;
    let segmentEndMs = probe.durationMs;
    const outputFps = Math.min(fps, 30); // cap at 30fps for reasonable processing

    if (overlay.type === "motion" && overlay.segment) {
      segmentStartMs = overlay.segment.startMs;
      segmentEndMs = overlay.segment.endMs;
    }

    const segmentDurationMs = segmentEndMs - segmentStartMs;
    const totalFrames = Math.ceil((segmentDurationMs / 1000) * outputFps);

    if (totalFrames <= 0 || totalFrames > 10000) {
      throw new Error(
        `Invalid frame count: ${totalFrames}. Segment: ${segmentDurationMs}ms at ${outputFps}fps`
      );
    }

    // ── 4. Extract frames from the segment ──────────────────────
    const framesDir = path.join(tmpDir, "frames");
    await fs.mkdir(framesDir, { recursive: true });

    updateJob(jobId, { progress: 15 });

    await execFileAsync(FFMPEG_BIN, [
      "-y",
      "-i",
      inputPath,
      "-ss",
      String(segmentStartMs / 1000),
      "-t",
      String(segmentDurationMs / 1000),
      "-vf",
      `fps=${outputFps}`,
      "-q:v",
      "2",
      path.join(framesDir, "frame_%05d.png"),
    ]);

    // List extracted frames
    const frameFiles = (await fs.readdir(framesDir))
      .filter((f) => f.startsWith("frame_") && f.endsWith(".png"))
      .sort();

    if (frameFiles.length === 0) {
      throw new Error("ffmpeg extracted 0 frames from the video");
    }

    updateJob(jobId, { progress: 30 });

    // ── 5. Render overlays for each frame ───────────────────────
    const composedDir = path.join(tmpDir, "composed");
    await fs.mkdir(composedDir, { recursive: true });

    const watermarkSvg = renderWatermarkSvg(width, height);
    const watermarkBuffer = Buffer.from(watermarkSvg);

    for (let i = 0; i < frameFiles.length; i++) {
      const frameFile = frameFiles[i];
      const framePath = path.join(framesDir, frameFile);
      const composedPath = path.join(composedDir, frameFile);

      // Time for this frame relative to segment start
      const frameTimeMs = Math.round((i / outputFps) * 1000);

      // Generate overlay SVG
      let overlaySvg: string;

      if (overlay.type === "motion") {
        const closestFrame = findClosestFrame(overlay.poseFrames, frameTimeMs);
        if (closestFrame) {
          overlaySvg = renderMotionOverlaySvg(closestFrame, width, height);
        } else {
          overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;
        }
      } else {
        overlaySvg = renderLiftOverlaySvg(
          overlay.barPath,
          frameTimeMs,
          width,
          height
        );
      }

      const overlayBuffer = Buffer.from(overlaySvg);

      // Composite: original frame + overlay + watermark
      await sharp(framePath)
        .composite([
          { input: overlayBuffer, top: 0, left: 0 },
          { input: watermarkBuffer, top: 0, left: 0 },
        ])
        .png()
        .toFile(composedPath);

      // Update progress (30% → 80% range)
      if (i % 10 === 0 || i === frameFiles.length - 1) {
        const pct = 30 + Math.round((i / frameFiles.length) * 50);
        updateJob(jobId, { progress: pct });
      }
    }

    updateJob(jobId, { progress: 80 });

    // ── 6. Compose final video with ffmpeg ──────────────────────
    const outputPath = path.join(tmpDir, "output.mp4");

    // Get audio from original video for the segment
    const hasAudio = await videoHasAudio(inputPath);

    const ffmpegArgs = [
      "-y",
      "-framerate",
      String(outputFps),
      "-i",
      path.join(composedDir, "frame_%05d.png"),
    ];

    if (hasAudio) {
      ffmpegArgs.push(
        "-ss",
        String(segmentStartMs / 1000),
        "-t",
        String(segmentDurationMs / 1000),
        "-i",
        inputPath
      );
    }

    ffmpegArgs.push(
      "-filter_complex",
      hasAudio ? "[0:v]format=yuv420p[v]" : "[0:v]format=yuv420p[v]",
      "-map",
      "[v]"
    );

    if (hasAudio) {
      ffmpegArgs.push("-map", "1:a?");
    }

    ffmpegArgs.push(
      "-c:v",
      "libx264",
      "-crf",
      "20",
      "-preset",
      "fast",
      "-movflags",
      "+faststart",
      outputPath
    );

    await execFileAsync(FFMPEG_BIN, ffmpegArgs);

    updateJob(jobId, { progress: 90 });

    // ── 7. Upload to B2 ─────────────────────────────────────────
    const outputBuffer = await fs.readFile(outputPath);
    const fileName = `export_${jobId}.mp4`;

    const uploadResult = await uploadToB2({
      file: outputBuffer,
      fileName,
      contentType: "video/mp4",
      folder: "exports",
    });

    updateJob(jobId, {
      status: "done",
      progress: 100,
      downloadUrl: uploadResult.url,
    });
  } catch (error) {
    console.error(`[video-export] Job ${jobId} failed:`, error);
    updateJob(jobId, {
      status: "error",
      error:
        error instanceof Error ? error.message : "Unknown processing error",
    });
  } finally {
    // ── 8. Cleanup temp directory ───────────────────────────────
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn(`[video-export] Failed to cleanup ${tmpDir}:`, cleanupErr);
    }
  }
}

/** Check if a video file has an audio stream */
async function videoHasAudio(videoPath: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync(FFPROBE_BIN, [
      "-v",
      "quiet",
      "-select_streams",
      "a:0",
      "-show_entries",
      "stream=codec_type",
      "-print_format",
      "json",
      videoPath,
    ]);
    const result = JSON.parse(stdout);
    return (result.streams?.length ?? 0) > 0;
  } catch {
    return false;
  }
}
