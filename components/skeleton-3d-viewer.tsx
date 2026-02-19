"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
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

// ── Skeleton Mesh Component ──────────────────────────────────────────────

interface SkeletonMeshProps {
  frame: SkeletonFrame;
  useWorldCoords: boolean;
}

function SkeletonMesh({ frame, useWorldCoords }: SkeletonMeshProps) {
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const bonesGroupRef = useRef<THREE.Group>(null);

  // Pre-create geometry & material for joints
  const jointGeometry = useMemo(
    () => new THREE.SphereGeometry(0.012, 12, 12),
    []
  );
  const jointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );

  // Compute positions for this frame
  const { positions, boneSegments } = useMemo(() => {
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
        // World coords: X = right, Y = up (negate API Y which is down), Z = toward camera
        pos = new THREE.Vector3(lm.worldX, -lm.worldY, -lm.worldZ);
      } else {
        // Normalized coords: map [0,1] to [-0.5, 0.5], flip Y
        pos = new THREE.Vector3(lm.x - 0.5, -(lm.y - 0.5), -lm.z * 0.3);
      }
      positions.set(lm.index, pos);
    }

    const boneSegments: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      key: string;
    }[] = [];
    for (const bone of frame.bones) {
      const start = positions.get(bone.startIndex);
      const end = positions.get(bone.endIndex);
      if (start && end) {
        boneSegments.push({
          start,
          end,
          key: `${bone.startName}_${bone.endName}`,
        });
      }
    }

    return { positions, boneSegments };
  }, [frame, useWorldCoords]);

  // Update instanced mesh for joints
  useEffect(() => {
    const mesh = jointsRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    let i = 0;
    for (const pos of positions.values()) {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      i++;
    }
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <group ref={bonesGroupRef}>
      {/* Joints as instanced spheres */}
      <instancedMesh
        ref={jointsRef}
        args={[jointGeometry, jointMaterial, 33]}
      />

      {/* Bones as cylinders */}
      {boneSegments.map((seg, i) => {
        const mid = new THREE.Vector3().lerpVectors(seg.start, seg.end, 0.5);
        const dir = new THREE.Vector3().subVectors(seg.end, seg.start);
        const length = dir.length();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );

        const color = BONE_COLORS[seg.key] || DEFAULT_BONE_COLOR;

        return (
          <mesh key={i} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.005, 0.005, length, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        );
      })}
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

// ── Animation Loop Component ─────────────────────────────────────────────

interface AnimatedSkeletonProps {
  frames: SkeletonFrame[];
  currentFrameIndex: number;
  useWorldCoords: boolean;
}

function AnimatedSkeleton({
  frames,
  currentFrameIndex,
  useWorldCoords,
}: AnimatedSkeletonProps) {
  const clampedIndex = Math.min(
    Math.max(currentFrameIndex, 0),
    frames.length - 1
  );
  const frame = frames[clampedIndex];

  if (!frame || frame.landmarks.length === 0) {
    return null;
  }

  return <SkeletonMesh frame={frame} useWorldCoords={useWorldCoords} />;
}

// ── Main Exported Component ──────────────────────────────────────────────

interface Skeleton3DViewerProps {
  /** All skeleton frames from the analysis */
  frames: SkeletonFrame[];
  /** Current frame index to display (synced with video) */
  currentFrameIndex: number;
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
      >
        <PerspectiveCamera makeDefault position={[0, 0, 1.5]} fov={50} />
        <AutoCenter frame={firstValidFrame} useWorldCoords={useWorldCoords} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        {/* Ground */}
        <GroundGrid />

        {/* Skeleton */}
        <AnimatedSkeleton
          frames={frames}
          currentFrameIndex={currentFrameIndex}
          useWorldCoords={useWorldCoords}
        />
      </Canvas>
    </div>
  );
}
