import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import type { PoseFrame } from "@/src/types/motion-analysis";
import {
  SKELETON_EDGES,
  FACE_KEYPOINTS,
  MIN_KEYPOINT_SCORE,
  getFrameBoundingBox,
} from "@/src/lib/pose-utils";

interface StickmanRendererProps {
  /** Current pose frame to render */
  frame: PoseFrame | null;
  /** Container width in px */
  width: number;
  /** Container height in px */
  height: number;
  /**
   * "overlay" = draw in normalised video coords (0..1 → px).
   * "replay"  = auto-center & scale the stickman to fill the viewport.
   */
  mode: "overlay" | "replay";
  /**
   * Original video aspect ratio (width/height).
   * Used in overlay mode to correctly map normalised coords when the
   * container aspect ratio differs from the video (letterbox/pillarbox).
   */
  videoAspectRatio?: number;
  /** Stroke color for bones */
  boneColor?: string;
  /** Stroke width for bones */
  boneWidth?: number;
  /** Joint dot radius */
  jointRadius?: number;
  /** Joint dot color */
  jointColor?: string;
  /** Opacity for bones (0-1) */
  boneOpacity?: number;
  /** Opacity for joints (0-1) */
  jointOpacity?: number;
}

export function StickmanRenderer({
  frame,
  width,
  height,
  mode,
  videoAspectRatio,
  boneColor = "#00FF88",
  boneWidth = 3,
  jointRadius = 5,
  jointColor = "#FFFFFF",
  boneOpacity = 0.75,
  jointOpacity = 0.8,
}: StickmanRendererProps) {
  // Compute overlay offset/scale to account for video letterboxing/pillarboxing.
  // The VideoView uses "contain" fitting by default: the video is scaled to fit
  // the container while preserving aspect ratio, potentially leaving black bars.
  // We must apply the same transform to normalised pose coords.
  const overlayTransform = useMemo(() => {
    if (
      mode !== "overlay" ||
      !videoAspectRatio ||
      width === 0 ||
      height === 0
    ) {
      return null;
    }

    const containerAR = width / height;

    if (Math.abs(containerAR - videoAspectRatio) < 0.01) {
      // Aspect ratios match — no correction needed
      return null;
    }

    let renderW: number;
    let renderH: number;

    if (videoAspectRatio > containerAR) {
      // Video is wider than container → pillarboxing (black bars top/bottom)
      renderW = width;
      renderH = width / videoAspectRatio;
    } else {
      // Video is taller than container → letterboxing (black bars left/right)
      renderH = height;
      renderW = height * videoAspectRatio;
    }

    const offsetX = (width - renderW) / 2;
    const offsetY = (height - renderH) / 2;

    return { renderW, renderH, offsetX, offsetY };
  }, [mode, videoAspectRatio, width, height]);

  // Compute transform for replay mode
  const replayTransform = useMemo(() => {
    if (!frame || mode !== "replay") return null;

    const bbox = getFrameBoundingBox(frame);
    if (!bbox) return null;

    const bboxW = bbox.maxX - bbox.minX;
    const bboxH = bbox.maxY - bbox.minY;
    if (bboxW <= 0 || bboxH <= 0) return null;

    const padding = 0.12; // 12% padding
    const paddedMinX = bbox.minX - bboxW * padding;
    const paddedMinY = bbox.minY - bboxH * padding;
    const paddedW = bboxW * (1 + 2 * padding);
    const paddedH = bboxH * (1 + 2 * padding);

    // Scale to fit container while keeping aspect ratio
    const scaleX = width / paddedW;
    const scaleY = height / paddedH;
    const scale = Math.min(scaleX, scaleY);

    const rW = paddedW * scale;
    const rH = paddedH * scale;
    const oX = (width - rW) / 2;
    const oY = (height - rH) / 2;

    return {
      paddedMinX,
      paddedMinY,
      paddedW,
      paddedH,
      scale,
      offsetX: oX,
      offsetY: oY,
    };
  }, [frame, mode, width, height]);

  // Compute keypoint map
  const kpMap = useMemo(
    () => new Map(frame?.keypoints.map((kp) => [kp.name, kp]) || []),
    [frame]
  );

  if (!frame || width === 0 || height === 0) return null;

  /** Convert normalised coords → pixel coords */
  const toPixel = (nx: number, ny: number): { px: number; py: number } => {
    if (mode === "overlay") {
      if (overlayTransform) {
        const { renderW, renderH, offsetX, offsetY } = overlayTransform;
        return {
          px: nx * renderW + offsetX,
          py: ny * renderH + offsetY,
        };
      }
      return { px: nx * width, py: ny * height };
    }
    // replay mode
    if (!replayTransform) return { px: nx * width, py: ny * height };
    const { paddedMinX, paddedMinY, scale, offsetX, offsetY } = replayTransform;
    return {
      px: (nx - paddedMinX) * scale + offsetX,
      py: (ny - paddedMinY) * scale + offsetY,
    };
  };

  /**
   * Draw a "foot stub" from the ankle, extending slightly downward
   * to give the appearance of feet. MoveNet doesn't have toe keypoints.
   */
  const renderFootStubs = () => {
    const stubs: React.ReactElement[] = [];
    for (const side of ["left", "right"] as const) {
      const ankle = kpMap.get(`${side}_ankle`);
      const knee = kpMap.get(`${side}_knee`);
      if (
        !ankle ||
        !knee ||
        ankle.score < MIN_KEYPOINT_SCORE ||
        knee.score < MIN_KEYPOINT_SCORE
      )
        continue;

      // Compute a short foot stub extending from the ankle
      // Direction: slightly forward (perpendicular to shin)
      const shinDx = ankle.x - knee.x;
      const shinDy = ankle.y - knee.y;
      const shinLen = Math.sqrt(shinDx * shinDx + shinDy * shinDy);
      if (shinLen === 0) continue;

      // Foot length ~25% of shin length, angled slightly forward
      const footLen = shinLen * 0.3;
      // Perpendicular direction (forward = towards camera, roughly horizontal)
      const perpX = -shinDy / shinLen; // perpendicular
      const footX =
        ankle.x +
        perpX * footLen * (side === "left" ? -0.3 : 0.3) +
        (shinDx / shinLen) * footLen * 0.5;
      const footY = ankle.y + footLen * 0.4;

      const p1 = toPixel(ankle.x, ankle.y);
      const p2 = toPixel(footX, footY);

      stubs.push(
        <Line
          key={`foot-${side}`}
          x1={p1.px}
          y1={p1.py}
          x2={p2.px}
          y2={p2.py}
          stroke={boneColor}
          strokeWidth={boneWidth}
          strokeLinecap="round"
          opacity={boneOpacity}
        />
      );
      // Toe dot
      stubs.push(
        <Circle
          key={`toe-${side}`}
          cx={p2.px}
          cy={p2.py}
          r={jointRadius * 0.7}
          fill={jointColor}
          stroke={boneColor}
          strokeWidth={1}
          opacity={Math.min(jointOpacity, ankle.score)}
        />
      );
    }
    return stubs;
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, { width, height }]}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>
        {/* Skeleton edges (bones) */}
        {SKELETON_EDGES.map(([a, b], index) => {
          const ka = kpMap.get(a);
          const kb = kpMap.get(b);
          if (
            !ka ||
            !kb ||
            ka.score < MIN_KEYPOINT_SCORE ||
            kb.score < MIN_KEYPOINT_SCORE
          )
            return null;

          const p1 = toPixel(ka.x, ka.y);
          const p2 = toPixel(kb.x, kb.y);

          return (
            <Line
              key={`bone-${index}`}
              x1={p1.px}
              y1={p1.py}
              x2={p2.px}
              y2={p2.py}
              stroke={boneColor}
              strokeWidth={boneWidth}
              strokeLinecap="round"
              opacity={boneOpacity}
            />
          );
        })}

        {/* Foot stubs */}
        {renderFootStubs()}

        {/* Joints */}
        {frame.keypoints.map((kp) => {
          if (kp.score < MIN_KEYPOINT_SCORE) return null;
          // Skip face keypoints (eyes, ears) — only keep nose as head indicator
          if (FACE_KEYPOINTS.has(kp.name) && kp.name !== "nose") return null;
          const p = toPixel(kp.x, kp.y);
          // Bigger radius for major joints
          const isMajorJoint =
            kp.name.includes("knee") ||
            kp.name.includes("ankle") ||
            kp.name.includes("hip") ||
            kp.name.includes("elbow") ||
            kp.name.includes("wrist") ||
            kp.name.includes("shoulder");
          const r = isMajorJoint ? jointRadius : jointRadius * 0.6;
          return (
            <Circle
              key={`joint-${kp.name}`}
              cx={p.px}
              cy={p.py}
              r={r}
              fill={jointColor}
              stroke={boneColor}
              strokeWidth={1.5}
              opacity={Math.min(jointOpacity, Math.max(0.4, kp.score))}
            />
          );
        })}
      </Svg>
    </View>
  );
}
