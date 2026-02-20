/**
 * Plate Tracker — Automatic barbell plate tracking.
 *
 * Workflow:
 *   1. User taps the plate/weight ONCE in the seed frame
 *   2. We extract thumbnails at regular intervals (expo-video-thumbnails)
 *   3. For each frame we run OpenCV template-matching (matchTemplate) on a
 *      search region around the last-known position
 *   4. The best match in each frame → bar path
 *
 * Uses react-native-fast-opencv for the CV operations and
 * expo-video-thumbnails for frame extraction.
 *
 * NOTE: require() is intentional here — these are lazy-loaded native modules
 * that are not available in Expo Go. They must be required at runtime, not
 * imported at the top level.
 */
/* eslint-disable @typescript-eslint/no-require-imports */

import type { BarPathPoint } from "@/src/types/lift-analysis";
import { smoothPath } from "./bar-path-utils";

// ── Lazy-load native modules (not available in Expo Go) ──────────────
// Type-only imports are erased at compile time — safe in any runtime.
import type { Mat } from "react-native-fast-opencv";
import type {
  ObjectType as ObjectTypeEnum,
  ColorConversionCodes as ColorConversionCodesEnum,
  DataTypes as DataTypesEnum,
  TemplateMatchModes as TemplateMatchModesEnum,
  HoughModes as HoughModesEnum,
} from "react-native-fast-opencv";
import type * as VideoThumbnailsType from "expo-video-thumbnails";
import type { File as ExpoFileType } from "expo-file-system";

let _opencv: typeof import("react-native-fast-opencv") | null = null;
let _videoThumbnails: typeof VideoThumbnailsType | null = null;
let _ExpoFile: typeof ExpoFileType | null = null;

function getOpenCV() {
  if (!_opencv) {
    try {
      _opencv =
        require("react-native-fast-opencv") as typeof import("react-native-fast-opencv");
    } catch {
      throw new Error(
        "react-native-fast-opencv not available. Lift tracking requires a development build (not Expo Go). Please use a custom dev build."
      );
    }
    // Extra guard: the native module may load but be unlinked (proxy trap)
    if (!_opencv?.OpenCV) {
      _opencv = null;
      throw new Error(
        "react-native-fast-opencv native module is not linked. Please rebuild the app as a development build."
      );
    }
  }
  return {
    OpenCV: _opencv!.OpenCV,
    ObjectType: _opencv!.ObjectType as typeof ObjectTypeEnum,
    ColorConversionCodes: _opencv!
      .ColorConversionCodes as typeof ColorConversionCodesEnum,
    DataTypes: _opencv!.DataTypes as typeof DataTypesEnum,
    TemplateMatchModes: _opencv!
      .TemplateMatchModes as typeof TemplateMatchModesEnum,
    HoughModes: _opencv!.HoughModes as typeof HoughModesEnum,
  };
}

function getVideoThumbnails(): typeof VideoThumbnailsType {
  if (!_videoThumbnails) {
    _videoThumbnails =
      require("expo-video-thumbnails") as typeof VideoThumbnailsType;
  }
  return _videoThumbnails!;
}

function getExpoFile(): typeof ExpoFileType {
  if (!_ExpoFile) {
    _ExpoFile = (require("expo-file-system") as { File: typeof ExpoFileType })
      .File;
  }
  return _ExpoFile!;
}

// ── Types ────────────────────────────────────────────────────────────

export interface TrackingProgress {
  current: number;
  total: number;
  /** Label for the current step */
  step: "extracting" | "tracking";
}

export interface TrackingResult {
  barPath: BarPathPoint[];
  durationMs: number;
}

export interface DetectedCircle {
  /** Center x coordinate (normalized 0-1) */
  x: number;
  /** Center y coordinate (normalized 0-1) */
  y: number;
  /** Radius (normalized 0-1) */
  radius: number;
}

// ── Constants ────────────────────────────────────────────────────────

/**
 * Half-size (normalised 0-1) of the template patch around the user's tap.
 * With 0.06 on a 360px-wide thumbnail the template is ~43×43 px.
 */
const TEMPLATE_HALF_NORM = 0.06;

/**
 * How far (normalised) to search around the last known position per frame.
 * 0.15 → ±15 % of frame width.
 */
const SEARCH_RADIUS_NORM = 0.15;

/**
 * Search radius (normalized 0-1) around tap point when detecting circles.
 * 0.25 → search within ±25% of frame width/height around tap.
 */
const CIRCLE_DETECTION_RADIUS_NORM = 0.25;

// ── Helpers ──────────────────────────────────────────────────────────

/** Read a local file URI as a base64 string */
async function readAsBase64(uri: string): Promise<string> {
  const ExpoFile = getExpoFile();
  const file = new ExpoFile(uri);
  const buffer = await file.arrayBuffer();
  // Convert ArrayBuffer to base64 using Uint8Array
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Load an image file as an OpenCV Mat via base64 */
async function loadMat(uri: string): Promise<Mat> {
  const b64 = await readAsBase64(uri);
  const { OpenCV } = getOpenCV();
  return OpenCV.base64ToMat(b64);
}

/** Get dimensions of a Mat using matToBuffer */
function matSize(mat: Mat): { cols: number; rows: number } {
  const { OpenCV } = getOpenCV();
  const info = OpenCV.matToBuffer(mat, "uint8");
  return { cols: info.cols, rows: info.rows };
}

// ── Circle Detection ─────────────────────────────────────────────────

/**
 * HoughCircles parameter sets tried in order (most permissive first).
 * We stop as soon as one set finds at least one circle.
 */
const HOUGH_PARAM_SETS = [
  // Pass 1 — very permissive: good for clear gym footage
  { dp: 1, minDist: 15, param1: 60, param2: 12 },
  // Pass 2 — moderate
  { dp: 1, minDist: 20, param1: 80, param2: 18 },
  // Pass 3 — stricter, last resort
  { dp: 1, minDist: 30, param1: 100, param2: 25 },
] as const;

/**
 * Detect circular objects (barbell plates) near a tap point in a video frame.
 *
 * Strategy:
 *  1. Extract frame at `timeMs` with full quality.
 *  2. Convert to grayscale, apply light Gaussian blur.
 *  3. Equalise histogram so low-contrast plates become visible.
 *  4. Build ROI (±25 % of image width) around tap.
 *  5. Try up to 3 HoughCircles parameter sets (permissive → strict).
 *  6. Return the detected circle whose centre is closest to the tap.
 *
 * @param videoUri    Local URI of the video
 * @param tapNorm     Normalized {x, y} coordinates of the tap (0-1)
 * @param timeMs      Timestamp in video to extract frame (default 0)
 * @param onLog       Optional callback to push debug messages to the UI
 * @returns           Detected circle closest to tap point, or null if none found
 */
export async function detectCircleAtPoint(
  videoUri: string,
  tapNorm: { x: number; y: number },
  timeMs = 0,
  onLog?: (msg: string) => void
): Promise<DetectedCircle | null> {
  const log = (msg: string) => {
    console.log(`[PlateTracker] ${msg}`);
    onLog?.(msg);
  };

  try {
    const { OpenCV, ObjectType, ColorConversionCodes, DataTypes, HoughModes } =
      getOpenCV();
    const VT = getVideoThumbnails();

    // ── 1. Extract frame ────────────────────────────────────────────
    log(`extracting frame @ ${timeMs}ms …`);
    const thumbResult = await VT.getThumbnailAsync(videoUri, {
      time: timeMs,
      quality: 1.0,
    });
    log(`frame saved → …${thumbResult.uri.slice(-40)}`);

    // ── 2. Load + grayscale ─────────────────────────────────────────
    const src = await loadMat(thumbResult.uri);
    const gray = OpenCV.createObject(ObjectType.Mat, 1, 1, DataTypes.CV_8UC1);
    OpenCV.invoke("cvtColor", src, gray, ColorConversionCodes.COLOR_BGR2GRAY);

    const { cols: imgW, rows: imgH } = matSize(gray);
    log(
      `frame size: ${imgW}×${imgH} | tap px: (${Math.round(tapNorm.x * imgW)}, ${Math.round(tapNorm.y * imgH)})`
    );

    // ── 3. Light Gaussian blur (5×5) to reduce sensor noise ─────────
    const blurred = OpenCV.createObject(
      ObjectType.Mat,
      1,
      1,
      DataTypes.CV_8UC1
    );
    // API: GaussianBlur(src, dst, ksize: Size, sigmaX: number)
    const blurKsize = OpenCV.createObject(ObjectType.Size, 5, 5);
    OpenCV.invoke("GaussianBlur", gray, blurred, blurKsize, 1.5);

    // ── 4. Build ROI ────────────────────────────────────────────────
    const searchRadPx = Math.round(CIRCLE_DETECTION_RADIUS_NORM * imgW);
    const tapXpx = Math.round(tapNorm.x * imgW);
    const tapYpx = Math.round(tapNorm.y * imgH);

    const roiLeft = Math.max(0, tapXpx - searchRadPx);
    const roiTop = Math.max(0, tapYpx - searchRadPx);
    const roiRight = Math.min(imgW, tapXpx + searchRadPx);
    const roiBottom = Math.min(imgH, tapYpx + searchRadPx);
    const roiW = roiRight - roiLeft;
    const roiH = roiBottom - roiTop;
    log(`ROI: ${roiW}×${roiH} @ (${roiLeft}, ${roiTop})`);

    if (roiW < 40 || roiH < 40) {
      log(`⚠️ ROI too small — tap closer to centre`);
      OpenCV.clearBuffers();
      return null;
    }

    // Crop ROI from blurred image
    const roi = OpenCV.createObject(ObjectType.Mat, 1, 1, DataTypes.CV_8UC1);
    const roiRect = OpenCV.createObject(
      ObjectType.Rect,
      roiLeft,
      roiTop,
      roiW,
      roiH
    );
    OpenCV.invoke("crop", blurred, roi, roiRect);

    // ── 5. Multi-pass HoughCircles (permissive → strict) ────────────
    // API: HoughCircles(image, circles, method, dp, minDist, param1?, param2?)
    // Note: this library version does NOT expose minRadius/maxRadius params.
    const circles = OpenCV.createObject(
      ObjectType.Mat,
      1,
      1,
      DataTypes.CV_32FC3
    );
    const allDetected: Array<{ x: number; y: number; radius: number }> = [];

    for (let pass = 0; pass < HOUGH_PARAM_SETS.length; pass++) {
      const p = HOUGH_PARAM_SETS[pass];
      log(
        `HoughCircles pass ${pass + 1}/3 — dp=${p.dp} minDist=${p.minDist} p1=${p.param1} p2=${p.param2}`
      );

      OpenCV.invoke(
        "HoughCircles",
        roi,
        circles,
        HoughModes.HOUGH_GRADIENT,
        p.dp,
        p.minDist,
        p.param1,
        p.param2
      );

      const circleData = OpenCV.matToBuffer(circles, "float32");
      log(`  pass ${pass + 1} → ${circleData.cols} circle(s) found`);

      if (circleData.cols > 0) {
        for (let i = 0; i < circleData.cols; i++) {
          const offset = i * 3;
          const cx = circleData.buffer[offset];
          const cy = circleData.buffer[offset + 1];
          const r = circleData.buffer[offset + 2];
          // Convert ROI-local coords to full-image coords
          allDetected.push({ x: roiLeft + cx, y: roiTop + cy, radius: r });
          log(
            `    circle[${i}]: ROI-local (${cx.toFixed(1)}, ${cy.toFixed(1)}) r=${r.toFixed(1)}`
          );
        }
        // Found at least one — stop trying stricter params
        break;
      }
    }

    OpenCV.clearBuffers();

    if (allDetected.length === 0) {
      log("❌ no circles found in any pass");
      return null;
    }

    // ── 6. Pick circle closest to tap ───────────────────────────────
    let closest: { x: number; y: number; radius: number } | null = null;
    let minDist = Infinity;

    for (const circle of allDetected) {
      const dx = circle.x - tapXpx;
      const dy = circle.y - tapYpx;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = circle;
      }
    }

    if (!closest) return null;

    log(
      `✅ best circle: full-img (${closest.x.toFixed(1)}, ${closest.y.toFixed(1)}) r=${closest.radius.toFixed(1)} dist=${minDist.toFixed(1)}px`
    );

    return {
      x: closest.x / imgW,
      y: closest.y / imgH,
      radius: closest.radius / imgW,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    onLog?.(`❌ detectCircleAtPoint threw: ${msg}`);
    console.warn("[PlateTracker] Circle detection failed:", err);
    return null;
  }
}

// ── Main entry ───────────────────────────────────────────────────────

/**
 * Track the weight/plate automatically through the video.
 *
 * @param videoUri       Local URI of the recorded video
 * @param seedNorm       Normalised {x, y} of the tap (0–1)
 * @param durationMs     Total video duration in ms
 * @param onProgress     Optional progress callback
 * @param intervalMs     Desired interval between sampled frames (default 200)
 * @param maxFrames      Maximum number of frames to sample (default 50)
 */
export async function trackPlate(
  videoUri: string,
  seedNorm: { x: number; y: number },
  durationMs: number,
  onProgress?: (p: TrackingProgress) => void,
  intervalMs = 200,
  maxFrames = 50
): Promise<TrackingResult> {
  // Lazy-load OpenCV (native module, crashes in Expo Go if imported at top level)
  const {
    OpenCV,
    ObjectType,
    ColorConversionCodes,
    DataTypes,
    TemplateMatchModes,
  } = getOpenCV();

  // ── 1. Generate timestamps ───────────────────────────────────────
  const frameCount = Math.min(
    maxFrames,
    Math.max(5, Math.ceil(durationMs / intervalMs) + 1)
  );
  const frameStep = durationMs / (frameCount - 1);
  const timestamps: number[] = [];
  for (let i = 0; i < frameCount; i++) {
    timestamps.push(Math.round(i * frameStep));
  }

  const totalSteps = timestamps.length * 2; // extraction + tracking

  // ── 2. Extract thumbnails ────────────────────────────────────────
  const VT = getVideoThumbnails();
  const thumbs: { timeMs: number; uri: string }[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    onProgress?.({ current: i, total: totalSteps, step: "extracting" });
    try {
      const result = await VT.getThumbnailAsync(videoUri, {
        time: timestamps[i],
        quality: 0.7,
      });
      thumbs.push({ timeMs: timestamps[i], uri: result.uri });
    } catch {
      console.warn(
        `[PlateTracker] Failed to extract frame at ${timestamps[i]}ms`
      );
    }
  }

  if (thumbs.length < 2) {
    return fallback(seedNorm, durationMs);
  }

  // ── 3. Build the template from the first frame ───────────────────
  let templateMat: Mat;
  let templateW: number;
  let templateH: number;
  // We keep track of Mat IDs we want to preserve between clearBuffers calls
  const keepIds: string[] = [];

  try {
    // Load the first frame as an OpenCV Mat then convert to grayscale
    const src = await loadMat(thumbs[0].uri);
    const firstGray = OpenCV.createObject(
      ObjectType.Mat,
      1,
      1,
      DataTypes.CV_8UC1
    );
    OpenCV.invoke(
      "cvtColor",
      src,
      firstGray,
      ColorConversionCodes.COLOR_BGR2GRAY
    );

    // Get image dimensions
    const { cols: imgW, rows: imgH } = matSize(firstGray);

    // Compute template rectangle in pixels
    const halfPx = Math.round(TEMPLATE_HALF_NORM * imgW);
    const cx = Math.round(seedNorm.x * imgW);
    const cy = Math.round(seedNorm.y * imgH);

    const tplLeft = Math.max(0, cx - halfPx);
    const tplTop = Math.max(0, cy - halfPx);
    const tplRight = Math.min(imgW - 1, cx + halfPx);
    const tplBottom = Math.min(imgH - 1, cy + halfPx);
    templateW = tplRight - tplLeft;
    templateH = tplBottom - tplTop;

    if (templateW < 4 || templateH < 4) {
      OpenCV.clearBuffers();
      return fallback(seedNorm, durationMs);
    }

    // Crop the template from the first frame
    templateMat = OpenCV.createObject(ObjectType.Mat, 1, 1, DataTypes.CV_8UC1);
    const tplRect = OpenCV.createObject(
      ObjectType.Rect,
      tplLeft,
      tplTop,
      templateW,
      templateH
    );
    OpenCV.invoke("crop", firstGray, templateMat, tplRect);

    // Keep the template alive across clearBuffers calls
    keepIds.push(templateMat.id);
    OpenCV.clearBuffers(keepIds);
  } catch (err) {
    console.warn("[PlateTracker] Template build failed, using fallback:", err);
    OpenCV.clearBuffers();
    return fallback(seedNorm, durationMs);
  }

  // ── 4. Track across frames ───────────────────────────────────────
  let lastX = seedNorm.x;
  let lastY = seedNorm.y;

  const barPath: BarPathPoint[] = [
    { t: thumbs[0].timeMs, x: seedNorm.x, y: seedNorm.y },
  ];

  // Create a dummy mask mat (empty, same type/size as template) for matchTemplate
  const emptyMask = OpenCV.createObject(
    ObjectType.Mat,
    templateH,
    templateW,
    DataTypes.CV_8UC1
  );
  keepIds.push(emptyMask.id);

  for (let i = 1; i < thumbs.length; i++) {
    onProgress?.({
      current: thumbs.length + i,
      total: totalSteps,
      step: "tracking",
    });

    try {
      // Load frame and convert to grayscale
      const frameSrc = await loadMat(thumbs[i].uri);
      const frameGray = OpenCV.createObject(
        ObjectType.Mat,
        1,
        1,
        DataTypes.CV_8UC1
      );
      OpenCV.invoke(
        "cvtColor",
        frameSrc,
        frameGray,
        ColorConversionCodes.COLOR_BGR2GRAY
      );

      const { cols: fW, rows: fH } = matSize(frameGray);

      // Compute search region
      const searchRadPx = Math.round(SEARCH_RADIUS_NORM * fW);
      const cxPx = Math.round(lastX * fW);
      const cyPx = Math.round(lastY * fH);

      const roiLeft = Math.max(0, cxPx - searchRadPx);
      const roiTop = Math.max(0, cyPx - searchRadPx);
      const roiRight = Math.min(fW, cxPx + searchRadPx);
      const roiBottom = Math.min(fH, cyPx + searchRadPx);
      const roiW = roiRight - roiLeft;
      const roiH = roiBottom - roiTop;

      if (roiW <= templateW || roiH <= templateH) {
        barPath.push({ t: thumbs[i].timeMs, x: lastX, y: lastY });
        OpenCV.clearBuffers(keepIds);
        continue;
      }

      // Crop the search region from the frame
      const roi = OpenCV.createObject(ObjectType.Mat, 1, 1, DataTypes.CV_8UC1);
      const roiRect = OpenCV.createObject(
        ObjectType.Rect,
        roiLeft,
        roiTop,
        roiW,
        roiH
      );
      OpenCV.invoke("crop", frameGray, roi, roiRect);

      // Run template matching (TM_CCOEFF_NORMED)
      const matchResult = OpenCV.createObject(
        ObjectType.Mat,
        1,
        1,
        DataTypes.CV_32FC1
      );
      OpenCV.invoke(
        "matchTemplate",
        roi,
        templateMat,
        matchResult,
        TemplateMatchModes.TM_CCOEFF_NORMED,
        emptyMask
      );

      // Find the best match location
      const minMax = OpenCV.invoke("minMaxLoc", matchResult);

      // For TM_CCOEFF_NORMED, the maximum value is the best match
      const matchX = minMax.maxX + templateW / 2; // centre of match in ROI coords
      const matchY = minMax.maxY + templateH / 2;

      // Convert back to full-frame normalised coords
      const nx = (roiLeft + matchX) / fW;
      const ny = (roiTop + matchY) / fH;

      lastX = Math.max(0, Math.min(1, nx));
      lastY = Math.max(0, Math.min(1, ny));

      barPath.push({ t: thumbs[i].timeMs, x: lastX, y: lastY });

      // Clean up per-frame mats but keep template + mask
      OpenCV.clearBuffers(keepIds);
    } catch (err) {
      console.warn(`[PlateTracker] Frame ${i} tracking failed:`, err);
      barPath.push({ t: thumbs[i].timeMs, x: lastX, y: lastY });
      OpenCV.clearBuffers(keepIds);
    }
  }

  // Clean up everything
  OpenCV.clearBuffers();

  // ── 5. Smooth and return ─────────────────────────────────────────
  const smoothed = smoothPath(barPath, 2);

  return { barPath: smoothed, durationMs };
}

// ── Fallback ─────────────────────────────────────────────────────────

function fallback(
  seed: { x: number; y: number },
  durationMs: number
): TrackingResult {
  return {
    barPath: [
      { t: 0, x: seed.x, y: seed.y },
      { t: durationMs, x: seed.x, y: seed.y },
    ],
    durationMs,
  };
}
