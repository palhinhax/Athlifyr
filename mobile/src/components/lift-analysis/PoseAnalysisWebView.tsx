/**
 * PoseAnalysisWebView – Hidden WebView that runs MediaPipe Pose Landmarker.
 *
 * Loads the MediaPipe Tasks Vision WASM module in a hidden WebView and
 * exposes an imperative API for processing video frames through pose
 * estimation. The WebView is mounted invisibly and communicates with
 * React Native via injectJavaScript / postMessage.
 *
 * Architecture:
 *   1. On mount, loads MediaPipe model from CDN (~10MB, cached by browser)
 *   2. Parent calls processFrames() via ref
 *   3. Frames are sent one-by-one as base64 to the WebView
 *   4. WebView runs pose detection and returns landmarks via onMessage
 *   5. Results are collected and returned as a Promise
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
import type { ExtractedFrame } from "@/src/modules/frame-extractor";
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
   * Process an array of extracted frames through pose estimation.
   * @param frames  Extracted video frames with base64 image data.
   * @param onProgress  Callback with progress percentage (0–100).
   * @returns Pose estimation results for each frame.
   */
  processFrames: (
    frames: ExtractedFrame[],
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
  type: "ready" | "pose" | "poseError" | "error" | "status";
  frameIndex?: number;
  tMs?: number;
  landmarks?: MediaPipeLandmark[] | null;
  barCircles?: DetectedCircle[] | null;
  message?: string;
}

// ─── MediaPipe HTML ─────────────────────────────────────────────

const MEDIAPIPE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>body{margin:0;overflow:hidden;background:#000;}</style>
</head>
<body>
<canvas id="c" style="display:none;"></canvas>
<script type="module">
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
let poseLandmarker = null;

function send(data) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
}

// ── Hough Circle Transform – detect barbell weight plates ───────
// Runs on a downscaled copy to keep latency low (~50–150 ms).
function detectPlateCircles() {
  if (canvas.width < 20 || canvas.height < 20) return [];

  // Downscale for speed
  var maxDim = 300;
  var scl = Math.min(1.0, maxDim / Math.max(canvas.width, canvas.height));
  var w = Math.round(canvas.width * scl);
  var h = Math.round(canvas.height * scl);

  var tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  var tc = tmp.getContext("2d");
  tc.drawImage(canvas, 0, 0, w, h);
  var id = tc.getImageData(0, 0, w, h);
  var px = id.data;

  // 1. Grayscale
  var gray = new Float32Array(w * h);
  for (var i = 0; i < gray.length; i++) {
    var j = i * 4;
    gray[i] = px[j] * 0.299 + px[j + 1] * 0.587 + px[j + 2] * 0.114;
  }

  // 2. Gaussian blur (separable 5x5, sigma ≈ 1.0)
  var kn = [1, 4, 6, 4, 1];
  var kS = 16;
  var buf = new Float32Array(w * h);
  // horizontal
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var s = 0;
      for (var ki = -2; ki <= 2; ki++) {
        s += gray[y * w + Math.min(w - 1, Math.max(0, x + ki))] * kn[ki + 2];
      }
      buf[y * w + x] = s / kS;
    }
  }
  // vertical
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
        -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)]
        - 2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)]
        - gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];
      var gyv =
        -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)]
        + gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
      gx[idx] = gxv;
      gy[idx] = gyv;
      mag[idx] = Math.sqrt(gxv * gxv + gyv * gyv);
    }
  }

  // 4. Adaptive edge threshold (top ~12 % of gradient magnitudes)
  var mags = [];
  for (var i = 0; i < mag.length; i++) { if (mag[i] > 0) mags.push(mag[i]); }
  mags.sort(function (a, b) { return b - a; });
  var edgeTh = mags.length > 0 ? mags[Math.floor(mags.length * 0.12)] : 30;
  edgeTh = Math.max(edgeTh, 20);

  // 5. Gradient-direction Hough Circle Transform
  //    Plate radius range: ~2.5 %–20 % of frame height
  var minR = Math.max(5, Math.round(h * 0.025));
  var maxR = Math.round(h * 0.20);
  var acc = new Float32Array(w * h);

  for (var y = 1; y < h - 1; y++) {
    for (var x = 1; x < w - 1; x++) {
      var idx = y * w + x;
      if (mag[idx] < edgeTh) continue;
      var m = mag[idx];
      var dx = gx[idx] / m;
      var dy = gy[idx] / m;
      // Vote along gradient direction (both signs)
      for (var r = minR; r <= maxR; r += 2) {
        var cx1 = Math.round(x + r * dx);
        var cy1 = Math.round(y + r * dy);
        if (cx1 >= 0 && cx1 < w && cy1 >= 0 && cy1 < h) acc[cy1 * w + cx1]++;
        var cx2 = Math.round(x - r * dx);
        var cy2 = Math.round(y - r * dy);
        if (cx2 >= 0 && cx2 < w && cy2 >= 0 && cy2 < h) acc[cy2 * w + cx2]++;
      }
    }
  }

  // 6. Peak detection with greedy non-max suppression
  var minVotes = Math.max(10, (maxR - minR) * 1.5);
  var cands = [];
  for (var y = 2; y < h - 2; y++) {
    for (var x = 2; x < w - 2; x++) {
      if (acc[y * w + x] >= minVotes) {
        cands.push({ x: x, y: y, v: acc[y * w + x] });
      }
    }
  }
  cands.sort(function (a, b) { return b.v - a.v; });

  var nmsR = Math.max(minR, 12);
  var out = [];
  for (var ci = 0; ci < cands.length && out.length < 6; ci++) {
    var c = cands[ci];
    var skip = false;
    for (var ai = 0; ai < out.length; ai++) {
      var dd = Math.sqrt((c.x - out[ai].x) * (c.x - out[ai].x) + (c.y - out[ai].y) * (c.y - out[ai].y));
      if (dd < nmsR) { skip = true; break; }
    }
    if (!skip) out.push(c);
  }

  // Normalise to 0-1
  return out.map(function (c) { return { x: c.x / w, y: c.y / h, votes: c.v }; });
}

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
    send({ type: "error", message: err.message || "Failed to initialize MediaPipe" });
  }
}

// Process a single frame – called from RN via injectJavaScript
window._processFrame = async function (base64Data, frameIndex, tMs) {
  if (!poseLandmarker) {
    send({ type: "poseError", frameIndex, tMs, message: "Model not loaded" });
    return;
  }

  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = "data:image/jpeg;base64," + base64Data;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const result = poseLandmarker.detect(canvas);
    const landmarks =
      result.landmarks && result.landmarks.length > 0
        ? result.landmarks[0]
        : null;

    // Run Hough Circle Transform to detect barbell weight plates
    var barCircles = null;
    try {
      var circles = detectPlateCircles();
      if (circles.length > 0) barCircles = circles;
    } catch (circleErr) {
      // Circle detection is non-critical – silently continue
    }

    send({
      type: "pose",
      frameIndex,
      tMs,
      landmarks: landmarks
        ? landmarks.map((l) => ({
            x: l.x,
            y: l.y,
            z: l.z,
            visibility: l.visibility,
          }))
        : null,
      barCircles: barCircles,
    });
  } catch (err) {
    send({
      type: "poseError",
      frameIndex,
      tMs,
      message: err.message || "Detection failed",
    });
  }
};

initialize();
</script>
</body>
</html>
`;

// ─── Timeout for individual frame processing ────────────────────
const FRAME_TIMEOUT_MS = 15000;

// ─── Component ──────────────────────────────────────────────────

export const PoseAnalysisWebView = forwardRef<
  PoseAnalysisHandle,
  PoseAnalysisWebViewProps
>(function PoseAnalysisWebView({ onReady, onError }, ref) {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  // Map of pending frame resolvers keyed by frameIndex
  const pendingRef = useRef<Map<number, (result: PoseResult) => void>>(
    new Map()
  );

  // Process a single frame and return result via promise
  const processOneFrame = useCallback(
    (frame: ExtractedFrame): Promise<PoseResult> => {
      return new Promise<PoseResult>((resolve) => {
        const { index, tMs, base64 } = frame;

        // Register resolver
        pendingRef.current.set(index, resolve);

        // Inject the processing call
        // Base64 only contains [A-Za-z0-9+/=] so it's safe in a JS string
        webViewRef.current?.injectJavaScript(
          `window._processFrame("${base64}", ${index}, ${tMs}); true;`
        );

        // Timeout fallback
        setTimeout(() => {
          if (pendingRef.current.has(index)) {
            pendingRef.current.delete(index);
            resolve({
              frameIndex: index,
              tMs,
              landmarks: null,
              barCircles: null,
            });
          }
        }, FRAME_TIMEOUT_MS);
      });
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      isReady,
      processFrames: async (
        frames: ExtractedFrame[],
        onProgress?: (pct: number) => void
      ): Promise<PoseResult[]> => {
        if (!isReady || !webViewRef.current) {
          throw new Error("Pose analysis engine not ready");
        }

        const results: PoseResult[] = [];

        // Process frames sequentially to avoid overwhelming the WebView
        for (let i = 0; i < frames.length; i++) {
          const result = await processOneFrame(frames[i]);
          results.push(result);
          onProgress?.(((i + 1) / frames.length) * 100);
        }

        return results;
      },
    }),
    [isReady, processOneFrame]
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

          case "pose": {
            const resolver = pendingRef.current.get(data.frameIndex!);
            if (resolver) {
              pendingRef.current.delete(data.frameIndex!);
              resolver({
                frameIndex: data.frameIndex!,
                tMs: data.tMs!,
                landmarks: (data.landmarks as MediaPipeLandmark[]) ?? null,
                barCircles: (data.barCircles as DetectedCircle[]) ?? null,
              });
            }
            break;
          }

          case "poseError": {
            const errorResolver = pendingRef.current.get(data.frameIndex!);
            if (errorResolver) {
              pendingRef.current.delete(data.frameIndex!);
              errorResolver({
                frameIndex: data.frameIndex!,
                tMs: data.tMs!,
                landmarks: null,
                barCircles: null,
              });
            }
            break;
          }

          case "error":
            console.warn("Pose WebView error:", data.message);
            onError?.(data.message ?? "Unknown error");
            break;

          case "status":
            // Model loading status update (could be surfaced to UI)
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
        originWhitelist={["*"]}
        onMessage={handleMessage}
        // Prevent the WebView from navigating away
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
