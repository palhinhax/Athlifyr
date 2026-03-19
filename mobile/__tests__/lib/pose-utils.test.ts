import {
  SKELETON_EDGES,
  FACE_KEYPOINTS,
  MIN_KEYPOINT_SCORE,
  smoothPoseFrames,
  getKeypoint,
  findClosestFrameIndex,
  computePoseMetrics,
  getFrameBoundingBox,
} from "@/src/lib/pose-utils";
import type {
  PoseFrame,
  PoseKeypoint as PoseKP,
} from "@/src/types/motion-analysis";

// Helper to create a keypoint
function kp(name: string, x: number, y: number, score = 0.9): PoseKP {
  return { name: name as PoseKP["name"], x, y, score };
}

// Helper to create a minimal frame
function makeFrame(t: number, keypoints: PoseKP[]): PoseFrame {
  return { t, keypoints };
}

describe("SKELETON_EDGES", () => {
  it("contains 14 edges", () => {
    expect(SKELETON_EDGES).toHaveLength(14);
  });

  it("includes shoulder span", () => {
    expect(SKELETON_EDGES).toContainEqual(["left_shoulder", "right_shoulder"]);
  });

  it("includes hip span", () => {
    expect(SKELETON_EDGES).toContainEqual(["left_hip", "right_hip"]);
  });
});

describe("FACE_KEYPOINTS", () => {
  it("contains 5 face keypoints", () => {
    expect(FACE_KEYPOINTS.size).toBe(5);
  });

  it("includes nose and eyes", () => {
    expect(FACE_KEYPOINTS.has("nose")).toBe(true);
    expect(FACE_KEYPOINTS.has("left_eye")).toBe(true);
    expect(FACE_KEYPOINTS.has("right_eye")).toBe(true);
  });
});

describe("MIN_KEYPOINT_SCORE", () => {
  it("is 0.2", () => {
    expect(MIN_KEYPOINT_SCORE).toBe(0.2);
  });
});

describe("getKeypoint", () => {
  const frame = makeFrame(0, [
    kp("nose", 0.5, 0.3, 0.9),
    kp("left_eye", 0.4, 0.2, 0.1), // below threshold
  ]);

  it("returns keypoint with sufficient score", () => {
    const result = getKeypoint(frame, "nose");
    expect(result).toBeDefined();
    expect(result!.x).toBe(0.5);
  });

  it("returns undefined for low-score keypoint", () => {
    expect(getKeypoint(frame, "left_eye")).toBeUndefined();
  });

  it("returns undefined for missing keypoint", () => {
    expect(getKeypoint(frame, "left_wrist")).toBeUndefined();
  });
});

describe("findClosestFrameIndex", () => {
  const frames: PoseFrame[] = [
    makeFrame(0, []),
    makeFrame(100, []),
    makeFrame(200, []),
    makeFrame(300, []),
    makeFrame(400, []),
  ];

  it("returns -1 for empty frames", () => {
    expect(findClosestFrameIndex([], 100)).toBe(-1);
  });

  it("returns 0 for single frame", () => {
    expect(findClosestFrameIndex([makeFrame(50, [])], 100)).toBe(0);
  });

  it("returns exact match index", () => {
    expect(findClosestFrameIndex(frames, 200)).toBe(2);
  });

  it("returns closest frame for in-between time", () => {
    expect(findClosestFrameIndex(frames, 150)).toBe(1); // closer to 100 than 200
    expect(findClosestFrameIndex(frames, 250)).toBe(2); // closer to 200 than 300
  });

  it("returns last frame for time beyond range", () => {
    expect(findClosestFrameIndex(frames, 9999)).toBe(4);
  });

  it("returns first frame for time before range", () => {
    expect(findClosestFrameIndex(frames, -100)).toBe(0);
  });
});

describe("smoothPoseFrames", () => {
  it("returns frames unchanged when 2 or fewer", () => {
    const frames: PoseFrame[] = [makeFrame(0, [kp("nose", 0.5, 0.5)])];
    expect(smoothPoseFrames(frames)).toEqual(frames);
  });

  it("smooths keypoint positions over time", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [kp("nose", 0.5, 0.5, 0.9)]),
      makeFrame(100, [kp("nose", 0.7, 0.7, 0.9)]),
      makeFrame(200, [kp("nose", 0.5, 0.5, 0.9)]),
    ];
    const result = smoothPoseFrames(frames, 1);
    expect(result).toHaveLength(3);
    // Middle point should be smoothed toward neighbors
    expect(result[1].keypoints[0].x).not.toBe(0.7);
  });

  it("preserves timestamps", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [kp("nose", 0.5, 0.5)]),
      makeFrame(100, [kp("nose", 0.6, 0.6)]),
      makeFrame(200, [kp("nose", 0.5, 0.5)]),
    ];
    const result = smoothPoseFrames(frames);
    expect(result.map((f) => f.t)).toEqual([0, 100, 200]);
  });

  it("does not smooth low-confidence keypoints", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [kp("nose", 0.5, 0.5, 0.1)]),
      makeFrame(100, [kp("nose", 0.9, 0.9, 0.1)]),
      makeFrame(200, [kp("nose", 0.5, 0.5, 0.1)]),
    ];
    const result = smoothPoseFrames(frames, 1);
    // Low-score keypoints should be returned as-is
    expect(result[1].keypoints[0].x).toBe(0.9);
  });
});

describe("computePoseMetrics", () => {
  it("returns zero metrics for empty frames", () => {
    const result = computePoseMetrics([]);
    expect(result).toEqual({
      durationMs: 0,
      avgConfidence: 0,
      maxKneeFlexion: null,
      torsoAngleRange: null,
    });
  });

  it("computes duration from first to last frame", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [kp("nose", 0.5, 0.5)]),
      makeFrame(500, [kp("nose", 0.5, 0.5)]),
      makeFrame(1000, [kp("nose", 0.5, 0.5)]),
    ];
    const result = computePoseMetrics(frames);
    expect(result.durationMs).toBe(1000);
  });

  it("computes average confidence", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [kp("nose", 0.5, 0.5, 0.8), kp("left_eye", 0.4, 0.4, 0.6)]),
    ];
    const result = computePoseMetrics(frames);
    expect(result.avgConfidence).toBeCloseTo(0.7, 2);
  });

  it("computes knee flexion when joints are present", () => {
    const frames: PoseFrame[] = [
      makeFrame(0, [
        kp("left_hip", 0.5, 0.3, 0.9),
        kp("left_knee", 0.5, 0.5, 0.9),
        kp("left_ankle", 0.5, 0.7, 0.9),
      ]),
    ];
    const result = computePoseMetrics(frames);
    // Straight leg = ~180 degrees
    expect(result.maxKneeFlexion).toBeCloseTo(180, 0);
  });

  it("returns null knee flexion when joints are missing", () => {
    const frames: PoseFrame[] = [makeFrame(0, [kp("nose", 0.5, 0.5)])];
    const result = computePoseMetrics(frames);
    expect(result.maxKneeFlexion).toBeNull();
  });
});

describe("getFrameBoundingBox", () => {
  it("returns null for frame with no visible keypoints", () => {
    const frame = makeFrame(0, [kp("nose", 0.5, 0.5, 0.05)]);
    expect(getFrameBoundingBox(frame)).toBeNull();
  });

  it("computes bounding box of visible keypoints", () => {
    const frame = makeFrame(0, [
      kp("left_shoulder", 0.3, 0.4, 0.9),
      kp("right_shoulder", 0.7, 0.4, 0.9),
      kp("left_hip", 0.3, 0.8, 0.9),
      kp("right_hip", 0.7, 0.8, 0.9),
    ]);
    const box = getFrameBoundingBox(frame);
    expect(box).toEqual({ minX: 0.3, minY: 0.4, maxX: 0.7, maxY: 0.8 });
  });

  it("ignores low-score keypoints in bounding box", () => {
    const frame = makeFrame(0, [
      kp("nose", 0.1, 0.1, 0.05), // below threshold
      kp("left_shoulder", 0.5, 0.5, 0.9),
    ]);
    const box = getFrameBoundingBox(frame);
    expect(box).toEqual({ minX: 0.5, minY: 0.5, maxX: 0.5, maxY: 0.5 });
  });
});
