/**
 * AnalysisOverlay – SVG overlay that renders bar path, skeleton, and angles
 * on top of the video during analysis playback.
 *
 * Receives the full analysis data and the current playback time to
 * render the appropriate frame's visualization.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import Svg, {
  Circle,
  Line,
  Polyline,
  Text as SvgText,
  G,
} from "react-native-svg";
import type {
  BarPositionSample,
  PoseFrameData,
  FrameAngles,
  OverlayVisibility,
} from "@/src/types/lift-analysis";
import { getFrameAtTime } from "@/src/modules/mock-analysis";

interface AnalysisOverlayProps {
  /** Width of the overlay container in pixels. */
  width: number;
  /** Height of the overlay container in pixels. */
  height: number;
  /** Current playback time in milliseconds. */
  currentTimeMs: number;
  /** Total video duration in milliseconds. */
  durationMs: number;
  /** Bar path tracking data (normalized 0–1 coords). */
  barPath: BarPositionSample[];
  /** Pose data per frame (normalized 0–1 coords). */
  poseData: PoseFrameData[];
  /** Angle data per frame. */
  angleData: FrameAngles[];
  /** Which overlays are visible. */
  visibility: OverlayVisibility;
}

const BAR_DOT_RADIUS = 6;
const JOINT_RADIUS = 5;
const BONE_WIDTH = 3;
const BAR_PATH_WIDTH = 2.5;
const BAR_COLOR = "#FF4444";
const SKELETON_COLOR = "#00FF88";
const JOINT_COLOR = "#00DDFF";
const ANGLE_TEXT_COLOR = "#FFDD00";

export function AnalysisOverlay({
  width,
  height,
  currentTimeMs,
  durationMs,
  barPath,
  poseData,
  angleData,
  visibility,
}: AnalysisOverlayProps) {
  const totalFrames = poseData.length;
  const currentFrame = getFrameAtTime(currentTimeMs, totalFrames, durationMs);

  // Build bar path polyline up to the current frame
  const barPathPoints = useMemo(() => {
    if (!visibility.barPath || barPath.length === 0) return "";
    const frameIndex = getFrameAtTime(
      currentTimeMs,
      barPath.length,
      durationMs
    );
    return barPath
      .slice(0, frameIndex + 1)
      .map((s) => `${s.x * width},${s.y * height}`)
      .join(" ");
  }, [visibility.barPath, barPath, currentTimeMs, durationMs, width, height]);

  // Current bar position
  const currentBarPos = useMemo(() => {
    if (!visibility.barPath || barPath.length === 0) return null;
    const frameIndex = getFrameAtTime(
      currentTimeMs,
      barPath.length,
      durationMs
    );
    const sample = barPath[frameIndex];
    return { x: sample.x * width, y: sample.y * height };
  }, [visibility.barPath, barPath, currentTimeMs, durationMs, width, height]);

  // Current pose joints (scaled)
  const currentJoints = useMemo(() => {
    if (totalFrames === 0) return null;
    const frame = poseData[currentFrame];
    if (!frame) return null;
    return {
      ankle: {
        x: frame.joints.ankle.x * width,
        y: frame.joints.ankle.y * height,
      },
      knee: { x: frame.joints.knee.x * width, y: frame.joints.knee.y * height },
      hip: { x: frame.joints.hip.x * width, y: frame.joints.hip.y * height },
      shoulder: {
        x: frame.joints.shoulder.x * width,
        y: frame.joints.shoulder.y * height,
      },
    };
  }, [poseData, currentFrame, width, height, totalFrames]);

  // Current angles
  const currentAngles = useMemo(() => {
    if (angleData.length === 0) return null;
    return angleData[Math.min(currentFrame, angleData.length - 1)];
  }, [angleData, currentFrame]);

  if (width === 0 || height === 0) return null;

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {/* Bar Path Trail */}
      {visibility.barPath && barPathPoints.length > 0 && (
        <G>
          <Polyline
            points={barPathPoints}
            fill="none"
            stroke={BAR_COLOR}
            strokeWidth={BAR_PATH_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
          {currentBarPos && (
            <Circle
              cx={currentBarPos.x}
              cy={currentBarPos.y}
              r={BAR_DOT_RADIUS}
              fill={BAR_COLOR}
              opacity={0.95}
            />
          )}
        </G>
      )}

      {/* Skeleton */}
      {visibility.skeleton && currentJoints && (
        <G>
          {/* Bones: ankle→knee, knee→hip, hip→shoulder */}
          <Line
            x1={currentJoints.ankle.x}
            y1={currentJoints.ankle.y}
            x2={currentJoints.knee.x}
            y2={currentJoints.knee.y}
            stroke={SKELETON_COLOR}
            strokeWidth={BONE_WIDTH}
            strokeLinecap="round"
            opacity={0.85}
          />
          <Line
            x1={currentJoints.knee.x}
            y1={currentJoints.knee.y}
            x2={currentJoints.hip.x}
            y2={currentJoints.hip.y}
            stroke={SKELETON_COLOR}
            strokeWidth={BONE_WIDTH}
            strokeLinecap="round"
            opacity={0.85}
          />
          <Line
            x1={currentJoints.hip.x}
            y1={currentJoints.hip.y}
            x2={currentJoints.shoulder.x}
            y2={currentJoints.shoulder.y}
            stroke={SKELETON_COLOR}
            strokeWidth={BONE_WIDTH}
            strokeLinecap="round"
            opacity={0.85}
          />

          {/* Joint dots */}
          {Object.values(currentJoints).map((joint, i) => (
            <Circle
              key={i}
              cx={joint.x}
              cy={joint.y}
              r={JOINT_RADIUS}
              fill={JOINT_COLOR}
              opacity={0.9}
            />
          ))}
        </G>
      )}

      {/* Angles */}
      {visibility.angles && currentAngles && currentJoints && (
        <G>
          {/* Knee angle */}
          <SvgText
            x={currentJoints.knee.x + 14}
            y={currentJoints.knee.y - 6}
            fill={ANGLE_TEXT_COLOR}
            fontSize={13}
            fontWeight="bold"
            stroke="#000"
            strokeWidth={0.5}
          >
            {currentAngles.kneeDeg}°
          </SvgText>

          {/* Hip angle */}
          <SvgText
            x={currentJoints.hip.x + 14}
            y={currentJoints.hip.y - 6}
            fill={ANGLE_TEXT_COLOR}
            fontSize={13}
            fontWeight="bold"
            stroke="#000"
            strokeWidth={0.5}
          >
            {currentAngles.hipDeg}°
          </SvgText>
        </G>
      )}
    </Svg>
  );
}
