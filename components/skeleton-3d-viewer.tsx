"use client";

import { useRef, useMemo, useEffect, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { SkeletonFrame } from "@/types/lift-analysis";

// ── Constants ────────────────────────────────────────────────────────────

/** Minimum visibility to render a landmark */
const MIN_VISIBILITY = 0.5;

/** Colors for different body regions */
const BONE_COLORS: Record<string, string> = {
  // Torso
  left_shoulder_left_hip: "#4fc3f7",
  right_shoulder_right_hip: "#4fc3f7",
  left_shoulder_right_shoulder: "#4fc3f7",
  left_hip_right_hip: "#4fc3f7",

  // Left arm
  left_shoulder_left_elbow: "#66bb6a",
  left_elbow_left_wrist: "#66bb6a",
  left_wrist_left_pinky: "#a5d6a7",
  left_wrist_left_index: "#a5d6a7",
  left_wrist_left_thumb: "#a5d6a7",
  left_pinky_left_index: "#a5d6a7",

  // Right arm
  right_shoulder_right_elbow: "#ef5350",
  right_elbow_right_wrist: "#ef5350",
  right_wrist_right_pinky: "#ef9a9a",
  right_wrist_right_index: "#ef9a9a",
  right_wrist_right_thumb: "#ef9a9a",
  right_pinky_right_index: "#ef9a9a",

  // Left leg
  left_hip_left_knee: "#66bb6a",
  left_knee_left_ankle: "#66bb6a",
  left_ankle_left_heel: "#a5d6a7",
  left_heel_left_foot_index: "#a5d6a7",
  left_ankle_left_foot_index: "#a5d6a7",

  // Right leg
  right_hip_right_knee: "#ef5350",
  right_knee_right_ankle: "#ef5350",
  right_ankle_right_heel: "#ef9a9a",
  right_heel_right_foot_index: "#ef9a9a",
  right_ankle_right_foot_index: "#ef9a9a",

  // Face
  nose_left_eye_inner: "#ffcc80",
  left_eye_inner_left_eye: "#ffcc80",
  left_eye_left_eye_outer: "#ffcc80",
  left_eye_outer_left_ear: "#ffcc80",
  nose_right_eye_inner: "#ffcc80",
  right_eye_inner_right_eye: "#ffcc80",
  right_eye_right_eye_outer: "#ffcc80",
  right_eye_outer_right_ear: "#ffcc80",
  mouth_left_mouth_right: "#ffcc80",
};

const DEFAULT_BONE_COLOR = "#888888";

// Pre-convert bone colors to THREE.Color for fast lookup
const BONE_COLOR_MAP = new Map<string, THREE.Color>(
  Object.entries(BONE_COLORS).map(([k, v]) => [k, new THREE.Color(v)])
);
const DEFAULT_THREE_COLOR = new THREE.Color(DEFAULT_BONE_COLOR);

// ── Build landmark positions for a frame ────────────────────────────────

function buildPositions(
  frame: SkeletonFrame,
  useWorldCoords: boolean
): Map<number, THREE.Vector3> {
  const positions = new Map<number, THREE.Vector3>();
  for (const lm of frame.landmarks) {
    if (lm.visibility < MIN_VISIBILITY) continue;
    let pos: THREE.Vector3;
    if (
      useWorldCoords &&
      lm.worldX !== null &&
      lm.worldY !== null &&
      lm.worldZ !== null
    ) {
      pos = new THREE.Vector3(lm.worldX, -lm.worldY, -lm.worldZ);
    } else {
      pos = new THREE.Vector3(lm.x - 0.5, -(lm.y - 0.5), -lm.z * 0.3);
    }
    positions.set(lm.index, pos);
  }
  return positions;
}

// ── Skeleton Mesh Component — fully imperative, zero React re-renders ─────

interface SkeletonSceneProps {
  frames: SkeletonFrame[];
  useWorldCoords: boolean;
  /** If provided, frame index is driven by video.currentTime in useFrame (60fps) */
  videoRef?: RefObject<HTMLVideoElement | null>;
  /** Fallback: controlled frame index when no videoRef */
  currentFrameIndex: number;
  /** fps of the skeleton data, used to map video time → frame index */
  fps: number;
}

function SkeletonScene({
  frames,
  useWorldCoords,
  videoRef,
  currentFrameIndex,
  fps,
}: SkeletonSceneProps) {
  const MAX_JOINTS = 33;
  const MAX_BONES = 40;

  // ── Joint instanced mesh ──────────────────────────────────────────────
  const jointGeo = useMemo(() => new THREE.SphereGeometry(0.012, 8, 8), []);
  const jointMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );
  const jointsRef = useRef<THREE.InstancedMesh>(null);

  // ── Bone line segments ────────────────────────────────────────────────
  // Use LineSegments with a pre-allocated BufferGeometry — just update positions
  const bonePositionsBuf = useMemo(
    () => new Float32Array(MAX_BONES * 2 * 3), // 2 vertices × 3 floats per bone
    []
  );
  const boneColorsBuf = useMemo(
    () => new Float32Array(MAX_BONES * 2 * 3), // color per vertex
    []
  );
  const boneGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(bonePositionsBuf, 3)
    );
    geo.setAttribute("color", new THREE.BufferAttribute(boneColorsBuf, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [bonePositionsBuf, boneColorsBuf]);
  const boneMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2, // only works on WebGL2 / some platforms
      }),
    []
  );

  // Reusable scratch objects to avoid allocations in useFrame
  const _dummy = useMemo(() => new THREE.Object3D(), []);
  const lastFrameRef = useRef(-1);

  // ── Write frame to GPU objects ────────────────────────────────────────
  const writeFrame = useMemo(
    () => (frameIdx: number) => {
      if (frameIdx === lastFrameRef.current) return;
      lastFrameRef.current = frameIdx;

      const frame = frames[Math.max(0, Math.min(frameIdx, frames.length - 1))];
      if (!frame) return;

      const joints = jointsRef.current;
      if (!joints) return;

      const positions = buildPositions(frame, useWorldCoords);

      // Update joint instanced mesh
      let ji = 0;
      for (const pos of positions.values()) {
        _dummy.position.copy(pos);
        _dummy.updateMatrix();
        joints.setMatrixAt(ji, _dummy.matrix);
        ji++;
      }
      joints.count = ji;
      joints.instanceMatrix.needsUpdate = true;

      // Update bone line segments
      let bi = 0;
      for (const bone of frame.bones) {
        const start = positions.get(bone.startIndex);
        const end = positions.get(bone.endIndex);
        if (!start || !end) continue;
        if (bi >= MAX_BONES) break;

        const base = bi * 6;
        bonePositionsBuf[base] = start.x;
        bonePositionsBuf[base + 1] = start.y;
        bonePositionsBuf[base + 2] = start.z;
        bonePositionsBuf[base + 3] = end.x;
        bonePositionsBuf[base + 4] = end.y;
        bonePositionsBuf[base + 5] = end.z;

        const key = `${bone.startName}_${bone.endName}`;
        const col = BONE_COLOR_MAP.get(key) ?? DEFAULT_THREE_COLOR;
        boneColorsBuf[base] = col.r;
        boneColorsBuf[base + 1] = col.g;
        boneColorsBuf[base + 2] = col.b;
        boneColorsBuf[base + 3] = col.r;
        boneColorsBuf[base + 4] = col.g;
        boneColorsBuf[base + 5] = col.b;

        bi++;
      }
      boneGeo.setDrawRange(0, bi * 2);
      (boneGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (boneGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    },
    [frames, useWorldCoords, bonePositionsBuf, boneColorsBuf, boneGeo, _dummy]
  );

  // ── Sync to video via useFrame (60fps, no React state) ────────────────
  useFrame(() => {
    let frameIdx: number;
    if (videoRef?.current && fps > 0) {
      frameIdx = Math.floor(videoRef.current.currentTime * fps);
    } else {
      frameIdx = currentFrameIndex;
    }
    writeFrame(frameIdx);
  });

  // Initial write on mount / when frames change
  useEffect(() => {
    lastFrameRef.current = -1; // force redraw
    writeFrame(currentFrameIndex);
  }, [frames, writeFrame, currentFrameIndex]);

  return (
    <group>
      <instancedMesh ref={jointsRef} args={[jointGeo, jointMat, MAX_JOINTS]} />
      <lineSegments geometry={boneGeo} material={boneMat} />
    </group>
  );
}

// ── Auto-center camera helper ────────────────────────────────────────────

function AutoCenter({
  frame,
  useWorldCoords,
}: {
  frame: SkeletonFrame;
  useWorldCoords: boolean;
}) {
  const controlsRef = useRef<{
    target: THREE.Vector3;
    update: () => void;
  } | null>(null);

  useEffect(() => {
    if (!controlsRef.current || frame.landmarks.length === 0) return;

    const visibleLandmarks = frame.landmarks.filter(
      (lm) => lm.visibility >= MIN_VISIBILITY
    );
    if (visibleLandmarks.length === 0) return;

    let cx = 0,
      cy = 0,
      cz = 0;
    for (const lm of visibleLandmarks) {
      if (
        useWorldCoords &&
        lm.worldX !== null &&
        lm.worldY !== null &&
        lm.worldZ !== null
      ) {
        cx += lm.worldX;
        cy += -lm.worldY;
        cz += -lm.worldZ;
      } else {
        cx += lm.x - 0.5;
        cy += -(lm.y - 0.5);
        cz += -lm.z * 0.3;
      }
    }
    cx /= visibleLandmarks.length;
    cy /= visibleLandmarks.length;
    cz /= visibleLandmarks.length;

    controlsRef.current.target.set(cx, cy, cz);
    controlsRef.current.update();
    // Only run on mount / first frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrbitControls
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={controlsRef as any}
      enableDamping
      dampingFactor={0.1}
      enablePan
      enableZoom
      minDistance={0.3}
      maxDistance={5}
    />
  );
}

// ── Ground grid ──────────────────────────────────────────────────────────

function GroundGrid() {
  return (
    <gridHelper
      args={[2, 20, "#333333", "#222222"]}
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// ── Main Exported Component ──────────────────────────────────────────────

interface Skeleton3DViewerProps {
  /** All skeleton frames from the analysis */
  frames: SkeletonFrame[];
  /** Current frame index to display (fallback when no videoRef) */
  currentFrameIndex: number;
  /**
   * Optional ref to the <video> element. When provided, the 3D view is
   * driven directly by video.currentTime inside the Three.js render loop
   * at 60fps — no React state updates, perfectly smooth.
   */
  videoRef?: RefObject<HTMLVideoElement | null>;
  /**
   * Frames-per-second of the skeleton data.
   * Used to map video.currentTime → frame index when videoRef is provided.
   * Defaults to 25 if not given.
   */
  fps?: number;
  /** Container width */
  width?: number | string;
  /** Container height */
  height?: number | string;
  /** Use world coordinates (meters) instead of normalized */
  useWorldCoords?: boolean;
  /** CSS class */
  className?: string;
}

export function Skeleton3DViewer({
  frames,
  currentFrameIndex,
  videoRef,
  fps = 25,
  width = "100%",
  height = 400,
  useWorldCoords = true,
  className,
}: Skeleton3DViewerProps) {
  // Find the first frame with landmarks for initial camera setup
  const firstValidFrame = useMemo(
    () => frames.find((f) => f.landmarks.length > 0) || frames[0],
    [frames]
  );

  if (!frames.length) {
    return (
      <div className={className} style={{ width, height }}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Sem dados de esqueleto disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#0a0a0a", borderRadius: "0.5rem" }}
        frameloop="always"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 1.5]} fov={50} />
        <AutoCenter frame={firstValidFrame} useWorldCoords={useWorldCoords} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        {/* Ground */}
        <GroundGrid />

        {/* Skeleton — imperative, driven by useFrame at 60fps */}
        <SkeletonScene
          frames={frames}
          useWorldCoords={useWorldCoords}
          videoRef={videoRef}
          currentFrameIndex={currentFrameIndex}
          fps={fps}
        />
      </Canvas>
    </div>
  );
}
