/**
 * PoseAnalysisWebView – Hidden WebView that runs MediaPipe Pose Landmarker
 * combined with a Hough Circle Transform for barbell weight plate detection.
 *
 * NEW ARCHITECTURE (fast video-seek approach):
 *   1. On mount, loads MediaPipe model from CDN (~10MB, cached by browser)
 *   2. Parent calls startAnalysis(videoUri, startMs, endMs, fps) via ref
 *   3. A single message sends the video file:// URI to the WebView
 *   4. WebView loads the video internally, seeks frame-by-frame via
 *      <video>.currentTime = t; waits for "seeked" event; draws to canvas
 *   5. Per frame: MediaPipe detects pose + Hough Transform detects plates
 *   6. Only compact JSON results (~2KB/frame) return via postMessage
 *   7. No frame extraction, no base64 bridge transfer → 10-100x faster
 *
 * Bar detection strategy:
 *   PRIMARY  – Hough Circle Transform on each canvas frame
 *   FALLBACK – MediaPipe wrist landmark midpoint
 */

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import WebView, { type WebViewMessageEvent } from "react-native-webview";
import type {
  PoseResult,
  MediaPipeLandmark,
  DetectedCircle,
} from "@/src/modules/real-analysis";

// ─── Types ──────────────────────────────────────────────────────

export interface PoseAnalysisHandle {
  /** Whether the MediaPipe model is loaded and ready. */
  isReady: boolean;
  /**
   * Analyse a video by seeking through it frame-by-frame inside the WebView.
   * @param videoUri   file:// URI of the recorded video.
   * @param startMs    Start trim offset in milliseconds.
   * @param endMs      End trim offset in milliseconds (0 = full video).
   * @param fps        Frames per second to sample (default 12).
   * @param onProgress Callback with progress 0–100.
   */
  startAnalysis: (
    videoUri: string,
    startMs: number,
    endMs: number,
    fps?: number,
    onProgress?: (pct: number) => void
  ) => Promise<PoseResult[]>;
}

interface PoseAnalysisWebViewProps {
  /** Called when the MediaPipe model finishes loading. */
  onReady?: () => void;
  /** Called if model initialization fails. */
  onError?: (message: string) => void;
}

interface WebViewMessage {
  type: "ready" | "frame_result" | "analysis_complete" | "error" | "status";
  frameIndex?: number;
  tMs?: number;
  totalFrames?: number;
  landmarks?: MediaPipeLandmark[] | null;
  barCircles?: DetectedCircle[] | null;
  message?: string;
}

// ─── WebView HTML ────────────────────────────────────────────────
// The video is loaded INSIDE the WebView via a file:// URI.
// The WebView seeks through it frame-by-frame and runs:
//   • MediaPipe Pose Landmarker  (33 body landmarks)
//   • Hough Circle Transform     (barbell weight plate detection)
// Only compact JSON results are sent back – no base64 transfers.
// ────────────────────────────────────────────────────────────────

const MEDIAPIPE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; overflow:hidden; background:#000; }
    video, canvas { display:none; }
  </style>
</head>
<body>
<video id="v" playsinline muted></video>
<canvas id="c"></canvas>

<script type="module">
const video  = document.getElementById("v");
const canvas = document.getElementById("c");
const ctx    = canvas.getContext("2d", { willReadFrequently: true });

let poseLandmarker = null;

// ── Utility ──────────────────────────────────────────────────────
function send(data) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
}

// ── Hough Circle Transform – detect barbell weight plates ────────
// Runs on a downscaled copy to keep per-frame latency low.
function detectPlateCircles() {
  if (canvas.width < 20 || canvas.height < 20) return [];

  var maxDim = 320;
  var scl = Math.min(1.0, maxDim / Math.max(canvas.width, canvas.height));
  var w = Math.round(canvas.width  * scl);
  var h = Math.round(canvas.height * scl);

  var tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  var tc = tmp.getContext("2d", { willReadFrequently: true });
  tc.drawImage(canvas, 0, 0, w, h);
  var id = tc.getImageData(0, 0, w, h);
  var px = id.data;

  // 1. Grayscale
  var gray = new Float32Array(w * h);
  for (var i = 0; i < gray.length; i++) {
    var j = i * 4;
    gray[i] = px[j] * 0.299 + px[j + 1] * 0.587 + px[j + 2] * 0.114;
  }

  // 2. Gaussian blur – separable 5×5, sigma ≈ 1.0
  var kn = [1, 4, 6, 4, 1];
  var kS = 16;
  var buf = new Float32Array(w * h);
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var s = 0;
      for (var ki = -2; ki <= 2; ki++) {
        s += gray[y * w + Math.min(w - 1, Math.max(0, x + ki))] * kn[ki + 2];
      }
      buf[y * w + x] = s / kS;
    }
  }
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var s = 0;
      for (var ki = -2; ki <= 2; ki++) {
        s += buf[Math.min(h - 1, Math.max(0, y + ki)) * w + x] * kn[ki + 2];
      }
      gray[y * w + x] = s / kS;
    }
  }

  // 3. Sobel gradients
  var gx = new Float32Array(w * h);
  var gy = new Float32Array(w * h);
  var mag = new Float32Array(w * h);
  for (var y = 1; y < h - 1; y++) {
    for (var x = 1; x < w - 1; x++) {
      var idx = y * w + x;
      var gxv =
        -gray[(y-1)*w+(x-1)] + gray[(y-1)*w+(x+1)]
        - 2*gray[y*w+(x-1)] + 2*gray[y*w+(x+1)]
        - gray[(y+1)*w+(x-1)] + gray[(y+1)*w+(x+1)];
      var gyv =
        -gray[(y-1)*w+(x-1)] - 2*gray[(y-1)*w+x] - gray[(y-1)*w+(x+1)]
        + gray[(y+1)*w+(x-1)] + 2*gray[(y+1)*w+x] + gray[(y+1)*w+(x+1)];
      gx[idx] = gxv; gy[idx] = gyv;
      mag[idx] = Math.sqrt(gxv*gxv + gyv*gyv);
    }
  }

  // 4. Adaptive edge threshold (top ~12 % of gradient magnitudes)
  var mags = [];
  for (var i = 0; i < mag.length; i++) { if (mag[i] > 0) mags.push(mag[i]); }
  mags.sort(function(a,b){ return b-a; });
  var edgeTh = mags.length > 0 ? mags[Math.floor(mags.length * 0.12)] : 30;
  edgeTh = Math.max(edgeTh, 20);

  // 5. Gradient-direction Hough Circle Transform
  //    Plate radius range: ~2.5 %–20 % of frame height
  var minR = Math.max(5, Math.round(h * 0.025));
  var maxR = Math.round(h * 0.20);
  var acc  = new Float32Array(w * h);

  for (var y = 1; y < h - 1; y++) {
    for (var x = 1; x < w - 1; x++) {
      var idx = y * w + x;
      if (mag[idx] < edgeTh) continue;
      var m  = mag[idx];
      var dx = gx[idx] / m;
      var dy = gy[idx] / m;
      for (var r = minR; r <= maxR; r += 2) {
        var cx1 = Math.round(x + r * dx);
        var cy1 = Math.round(y + r * dy);
        if (cx1 >= 0 && cx1 < w && cy1 >= 0 && cy1 < h) acc[cy1*w+cx1]++;
        var cx2 = Math.round(x - r * dx);
        var cy2 = Math.round(y - r * dy);
        if (cx2 >= 0 && cx2 < w && cy2 >= 0 && cy2 < h) acc[cy2*w+cx2]++;
      }
    }
  }

  // 6. Peak detection with greedy non-max suppression
  var minVotes = Math.max(10, (maxR - minR) * 1.5);
  var cands = [];
  for (var y = 2; y < h - 2; y++) {
    for (var x = 2; x < w - 2; x++) {
      if (acc[y*w+x] >= minVotes) cands.push({ x, y, v: acc[y*w+x] });
    }
  }
  cands.sort(function(a,b){ return b.v - a.v; });

  var nmsR = Math.max(minR, 12);
  var out  = [];
  for (var ci = 0; ci < cands.length && out.length < 6; ci++) {
    var c = cands[ci];
    var skip = false;
    for (var ai = 0; ai < out.length; ai++) {
      var dd = Math.sqrt((c.x-out[ai].x)**2 + (c.y-out[ai].y)**2);
      if (dd < nmsR) { skip = true; break; }
    }
    if (!skip) out.push(c);
  }

  // Normalise to 0–1
  return out.map(function(c){ return { x: c.x/w, y: c.y/h, votes: c.v }; });
}

// ── MediaPipe initialisation ─────────────────────────────────────
async function initialize() {
  try {
    send({ type: "status", message: "Loading MediaPipe WASM..." });

    const { PoseLandmarker, FilesetResolver } = await import(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14"
    );

    send({ type: "status", message: "Loading pose model..." });

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numPoses: 1,
    });

    send({ type: "ready" });
  } catch (err) {
    send({ type: "error", message: (err && err.message) || "Failed to initialize MediaPipe" });
  }
}

// ── Per-frame processing ─────────────────────────────────────────
function processCurrentFrame(frameIndex, tMs) {
  try {
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // MediaPipe pose detection
    var result = poseLandmarker ? poseLandmarker.detect(canvas) : null;
    var rawLandmarks = (result && result.landmarks && result.landmarks.length > 0)
      ? result.landmarks[0] : null;

    var landmarks = rawLandmarks
      ? rawLandmarks.map(function(l){ return { x: l.x, y: l.y, z: l.z, visibility: l.visibility }; })
      : null;

    // Hough Circle Transform for barbell plate detection
    var barCircles = null;
    try {
      var circles = detectPlateCircles();
      if (circles.length > 0) barCircles = circles;
    } catch (_) { /* non-critical */ }

    send({ type: "frame_result", frameIndex, tMs, landmarks, barCircles });
  } catch (err) {
    // Still send a null result so the pipeline doesn't stall
    send({ type: "frame_result", frameIndex, tMs, landmarks: null, barCircles: null });
  }
}

// ── Video seek loop ──────────────────────────────────────────────
// Receives START_ANALYSIS from React Native and processes the video
// entirely inside the WebView without any base64 bridge transfer.
async function runAnalysis(config) {
  var videoUri = config.videoUri;
  var startMs  = config.startMs  || 0;
  var endMs    = config.endMs    || 0;
  var fps      = config.fps      || 12;

  return new Promise(function(resolve, reject) {
    video.src = videoUri;

    video.addEventListener("error", function() {
      reject(new Error("Video load failed: " + (video.error && video.error.message)));
    }, { once: true });

    video.addEventListener("loadedmetadata", async function() {
      var durationSec = video.duration;
      var startSec    = startMs / 1000;
      var endSec      = endMs > 0 ? Math.min(endMs / 1000, durationSec) : durationSec;
      var step        = 1 / fps;
      var times       = [];

      for (var t = startSec; t <= endSec + 0.001; t += step) {
        times.push(Math.min(t, endSec));
      }

      var totalFrames = times.length;
      send({ type: "status", message: "Analysing " + totalFrames + " frames..." });

      for (var fi = 0; fi < totalFrames; fi++) {
        var tSec = times[fi];
        var tMs  = Math.round(tSec * 1000);

        // Seek the video element to the desired frame
        await new Promise(function(res) {
          function onSeeked() {
            video.removeEventListener("seeked", onSeeked);
            res();
          }
          video.addEventListener("seeked", onSeeked);
          video.currentTime = tSec;
        });

        processCurrentFrame(fi, tMs);
      }

      send({ type: "analysis_complete", totalFrames });
      resolve();
    }, { once: true });
  });
}

// ── Message handler from React Native ───────────────────────────
document.addEventListener("message", function(event) {
  handleRNMessage(event.data);
});
window.addEventListener("message", function(event) {
  handleRNMessage(event.data);
});

function handleRNMessage(rawData) {
  try {
    var msg = JSON.parse(rawData);
    if (msg.type === "START_ANALYSIS") {
      if (!poseLandmarker) {
        send({ type: "error", message: "Model not ready yet" });
        return;
      }
      runAnalysis(msg.config).catch(function(err) {
        send({ type: "error", message: (err && err.message) || "Analysis failed" });
      });
    }
  } catch (_) { /* ignore malformed */ }
}

initialize();
</script>
</body>
</html>
`;

// ─── Analysis timeout ────────────────────────────────────────────
// 3 min max – generous for long videos, avoids infinite hang.
const ANALYSIS_TIMEOUT_MS = 3 * 60 * 1000;

// ─── Component ──────────────────────────────────────────────────

export const PoseAnalysisWebView = forwardRef<
  PoseAnalysisHandle,
  PoseAnalysisWebViewProps
>(function PoseAnalysisWebView({ onReady, onError }, ref) {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  // Current analysis state – resolve/reject + per-frame progress
  const analysisRef = useRef<{
    results: PoseResult[];
    totalFrames: number;
    resolve: (r: PoseResult[]) => void;
    reject: (e: Error) => void;
    onProgress?: (pct: number) => void;
    timeoutId: ReturnType<typeof setTimeout>;
  } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      isReady,
      startAnalysis: (
        videoUri: string,
        startMs: number,
        endMs: number,
        fps: number = 12,
        onProgress?: (pct: number) => void
      ): Promise<PoseResult[]> => {
        if (!isReady || !webViewRef.current) {
          return Promise.reject(new Error("Pose analysis engine not ready"));
        }

        return new Promise<PoseResult[]>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            if (analysisRef.current) {
              analysisRef.current = null;
              reject(new Error("Analysis timed out"));
            }
          }, ANALYSIS_TIMEOUT_MS);

          analysisRef.current = {
            results: [],
            totalFrames: 0,
            resolve,
            reject,
            onProgress,
            timeoutId,
          };

          // Send a single message – the WebView does all the heavy lifting
          webViewRef.current!.postMessage(
            JSON.stringify({
              type: "START_ANALYSIS",
              config: { videoUri, startMs, endMs, fps },
            })
          );
        });
      },
    }),
    [isReady]
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data: WebViewMessage = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "ready":
            setIsReady(true);
            onReady?.();
            break;

          case "frame_result": {
            const state = analysisRef.current;
            if (!state) break;

            state.results.push({
              frameIndex: data.frameIndex!,
              tMs: data.tMs!,
              landmarks: (data.landmarks as MediaPipeLandmark[]) ?? null,
              barCircles: (data.barCircles as DetectedCircle[]) ?? null,
            });

            // Progress based on received frames vs expected total
            if (state.totalFrames > 0) {
              const pct = Math.round(
                (state.results.length / state.totalFrames) * 100
              );
              state.onProgress?.(Math.min(pct, 99));
            }
            break;
          }

          case "analysis_complete": {
            const state = analysisRef.current;
            if (!state) break;
            clearTimeout(state.timeoutId);
            state.onProgress?.(100);
            const results = [...state.results].sort(
              (a, b) => a.frameIndex - b.frameIndex
            );
            analysisRef.current = null;
            state.resolve(results);
            break;
          }

          case "status": {
            // Try to parse total frame count from status messages
            const state = analysisRef.current;
            if (state && data.message) {
              const m = data.message.match(/Analysing (\d+) frames/);
              if (m) state.totalFrames = parseInt(m[1], 10);
            }
            break;
          }

          case "error":
            console.warn("Pose WebView error:", data.message);
            onError?.(data.message ?? "Unknown error");
            if (analysisRef.current) {
              const state = analysisRef.current;
              clearTimeout(state.timeoutId);
              analysisRef.current = null;
              state.reject(new Error(data.message ?? "WebView error"));
            }
            break;
        }
      } catch {
        // Ignore malformed messages
      }
    },
    [onReady, onError]
  );

  return (
    <View style={styles.hidden} pointerEvents="none">
      <WebView
        ref={webViewRef}
        source={{ html: MEDIAPIPE_HTML }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        originWhitelist={["*", "file://*"]}
        onMessage={handleMessage}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    overflow: "hidden",
    position: "absolute",
    opacity: 0,
  },
  webView: {
    width: 1,
    height: 1,
  },
});
