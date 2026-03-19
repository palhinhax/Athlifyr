/**
 * @jest-environment node
 */

import {
  transformSkeletonFrames,
  transformAiAnalysis,
  transformAverageAngles,
  parseRailwayErrorResponse,
  callRailwayWithRetry,
  getVideoExtension,
  buildTranscodeErrorResponse,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  type ExternalSkeletonFrame,
  type ExternalAIAnalysis,
  type PoseAngles,
} from "@/lib/analysis-transforms";

// ── transformSkeletonFrames ──────────────────────────────────────────────────

describe("transformSkeletonFrames", () => {
  it("transforms snake_case to camelCase for landmarks and bones", () => {
    const input: ExternalSkeletonFrame[] = [
      {
        frame_width: 1920,
        frame_height: 1080,
        landmarks: [
          {
            name: "nose",
            index: 0,
            x: 0.5,
            y: 0.3,
            z: 0.1,
            visibility: 0.99,
            pixel_x: 960,
            pixel_y: 324,
            world_x: 0.01,
            world_y: 0.02,
            world_z: 0.03,
          },
        ],
        bones: [
          {
            start_index: 0,
            end_index: 1,
            start_name: "nose",
            end_name: "left_eye",
          },
        ],
      },
    ];

    const result = transformSkeletonFrames(input);

    expect(result).toHaveLength(1);
    expect(result[0].frameWidth).toBe(1920);
    expect(result[0].frameHeight).toBe(1080);

    const lm = result[0].landmarks[0];
    expect(lm.pixelX).toBe(960);
    expect(lm.pixelY).toBe(324);
    expect(lm.worldX).toBe(0.01);
    expect(lm.worldY).toBe(0.02);
    expect(lm.worldZ).toBe(0.03);

    const bone = result[0].bones[0];
    expect(bone.startIndex).toBe(0);
    expect(bone.endIndex).toBe(1);
    expect(bone.startName).toBe("nose");
    expect(bone.endName).toBe("left_eye");
  });

  it("handles null world coordinates", () => {
    const input: ExternalSkeletonFrame[] = [
      {
        frame_width: 640,
        frame_height: 480,
        landmarks: [
          {
            name: "nose",
            index: 0,
            x: 0.5,
            y: 0.3,
            z: 0,
            visibility: 0.9,
            pixel_x: 320,
            pixel_y: 144,
            world_x: null,
            world_y: null,
            world_z: null,
          },
        ],
        bones: [],
      },
    ];

    const result = transformSkeletonFrames(input);
    const lm = result[0].landmarks[0];
    expect(lm.worldX).toBeNull();
    expect(lm.worldY).toBeNull();
    expect(lm.worldZ).toBeNull();
  });

  it("handles empty frames array", () => {
    expect(transformSkeletonFrames([])).toEqual([]);
  });

  it("handles multiple frames", () => {
    const frame: ExternalSkeletonFrame = {
      frame_width: 100,
      frame_height: 100,
      landmarks: [],
      bones: [],
    };
    const result = transformSkeletonFrames([frame, frame, frame]);
    expect(result).toHaveLength(3);
  });
});

// ── transformAiAnalysis ──────────────────────────────────────────────────────

describe("transformAiAnalysis", () => {
  it("returns null for null input", () => {
    expect(transformAiAnalysis(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(transformAiAnalysis(undefined)).toBeNull();
  });

  it("transforms full AI analysis from snake_case to camelCase", () => {
    const input: ExternalAIAnalysis = {
      exercise: "Agachamento",
      exercise_en: "Squat",
      confidence: 0.95,
      total_reps: 5,
      duration_sec: 30.5,
      tempo_avg_sec: 6.1,
      overall_score: 8.5,
      overall_notes: "Good form overall",
      reps: [
        {
          rep_number: 1,
          start_frame: 10,
          end_frame: 40,
          phase_eccentric_frames: [10, 25],
          phase_concentric_frames: [25, 40],
          min_knee_angle: 85.2,
          min_hip_angle: 72.1,
          rom_degrees: 120.5,
          form_score: 9.0,
          notes: ["Good depth"],
        },
      ],
      strengths: ["Consistent tempo"],
      improvements: ["Keep chest up"],
      safety_flags: [],
    };

    const result = transformAiAnalysis(input)!;

    expect(result.exercise).toBe("Agachamento");
    expect(result.exerciseEn).toBe("Squat");
    expect(result.confidence).toBe(0.95);
    expect(result.totalReps).toBe(5);
    expect(result.durationSec).toBe(30.5);
    expect(result.tempoAvgSec).toBe(6.1);
    expect(result.overallScore).toBe(8.5);
    expect(result.overallNotes).toBe("Good form overall");
    expect(result.strengths).toEqual(["Consistent tempo"]);
    expect(result.improvements).toEqual(["Keep chest up"]);
    expect(result.safetyFlags).toEqual([]);

    const rep = result.reps[0];
    expect(rep.repNumber).toBe(1);
    expect(rep.startFrame).toBe(10);
    expect(rep.endFrame).toBe(40);
    expect(rep.phaseEccentricFrames).toEqual([10, 25]);
    expect(rep.phaseConcentricFrames).toEqual([25, 40]);
    expect(rep.minKneeAngle).toBe(85.2);
    expect(rep.minHipAngle).toBe(72.1);
    expect(rep.romDegrees).toBe(120.5);
    expect(rep.formScore).toBe(9.0);
    expect(rep.notes).toEqual(["Good depth"]);
  });

  it("handles null fields gracefully (maps to null)", () => {
    const input: ExternalAIAnalysis = {
      exercise: null,
      exercise_en: null,
      confidence: null,
      total_reps: null,
      duration_sec: null,
      tempo_avg_sec: null,
      overall_score: null,
      overall_notes: null,
      reps: [],
      strengths: [],
      improvements: [],
      safety_flags: [],
    };

    const result = transformAiAnalysis(input)!;
    expect(result.exercise).toBeNull();
    expect(result.exerciseEn).toBeNull();
    expect(result.confidence).toBeNull();
    expect(result.totalReps).toBeNull();
    expect(result.durationSec).toBeNull();
    expect(result.tempoAvgSec).toBeNull();
    expect(result.overallScore).toBeNull();
    expect(result.overallNotes).toBeNull();
    expect(result.reps).toEqual([]);
  });

  it("handles reps with all null optional fields", () => {
    const input: ExternalAIAnalysis = {
      exercise: "Deadlift",
      exercise_en: "Deadlift",
      confidence: 0.8,
      total_reps: 1,
      duration_sec: 5,
      tempo_avg_sec: 5,
      overall_score: 7,
      overall_notes: null,
      reps: [
        {
          rep_number: 1,
          start_frame: null,
          end_frame: null,
          phase_eccentric_frames: null,
          phase_concentric_frames: null,
          min_knee_angle: null,
          min_hip_angle: null,
          rom_degrees: null,
          form_score: null,
          notes: [],
        },
      ],
      strengths: [],
      improvements: [],
      safety_flags: [],
    };

    const result = transformAiAnalysis(input)!;
    const rep = result.reps[0];
    expect(rep.startFrame).toBeNull();
    expect(rep.endFrame).toBeNull();
    expect(rep.phaseEccentricFrames).toBeNull();
    expect(rep.phaseConcentricFrames).toBeNull();
    expect(rep.minKneeAngle).toBeNull();
    expect(rep.minHipAngle).toBeNull();
    expect(rep.romDegrees).toBeNull();
    expect(rep.formScore).toBeNull();
    expect(rep.notes).toEqual([]);
  });
});

// ── transformAverageAngles ───────────────────────────────────────────────────

describe("transformAverageAngles", () => {
  it("returns null for undefined input", () => {
    expect(transformAverageAngles(undefined)).toBeNull();
  });

  it("transforms full angles from snake_case to camelCase", () => {
    const input: PoseAngles = {
      left_knee: 90,
      right_knee: 88,
      left_hip: 100,
      right_hip: 98,
      left_elbow: 160,
      right_elbow: 155,
      left_shoulder: 45,
      right_shoulder: 44,
      left_ankle: 80,
      right_ankle: 82,
      torso_inclination: 15,
    };

    const result = transformAverageAngles(input)!;
    expect(result.leftKnee).toBe(90);
    expect(result.rightKnee).toBe(88);
    expect(result.leftHip).toBe(100);
    expect(result.rightHip).toBe(98);
    expect(result.leftElbow).toBe(160);
    expect(result.rightElbow).toBe(155);
    expect(result.leftShoulder).toBe(45);
    expect(result.rightShoulder).toBe(44);
    expect(result.leftAnkle).toBe(80);
    expect(result.rightAnkle).toBe(82);
    expect(result.torsoInclination).toBe(15);
  });

  it("uses back_angle as fallback for torsoInclination", () => {
    const input: PoseAngles = {
      back_angle: 20,
    };
    const result = transformAverageAngles(input)!;
    expect(result.torsoInclination).toBe(20);
  });

  it("prefers torso_inclination over back_angle", () => {
    const input: PoseAngles = {
      torso_inclination: 15,
      back_angle: 20,
    };
    const result = transformAverageAngles(input)!;
    expect(result.torsoInclination).toBe(15);
  });

  it("returns null for missing angle fields", () => {
    const input: PoseAngles = {};
    const result = transformAverageAngles(input)!;
    expect(result.leftKnee).toBeNull();
    expect(result.rightKnee).toBeNull();
    expect(result.torsoInclination).toBeNull();
  });
});

// ── parseRailwayErrorResponse ────────────────────────────────────────────────

describe("parseRailwayErrorResponse", () => {
  it("parses array detail into joined message", async () => {
    const errorText = JSON.stringify({
      detail: [
        { loc: ["body", "video"], msg: "field required" },
        { msg: "Validation error" },
      ],
    });

    const res = parseRailwayErrorResponse(errorText, 422);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("body.video — field required; Validation error");
  });

  it("parses array detail with missing loc uses msg fallback", async () => {
    const errorText = JSON.stringify({
      detail: [{ loc: undefined, msg: undefined }],
    });

    const res = parseRailwayErrorResponse(errorText, 422);
    const body = await res.json();
    expect(body.error).toBe("Validation error");
  });

  it("parses string detail", async () => {
    const errorText = JSON.stringify({ detail: "Not allowed" });

    const res = parseRailwayErrorResponse(errorText, 403);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Not allowed");
  });

  it("parses error field fallback", async () => {
    const errorText = JSON.stringify({ error: "Something broke" });

    const res = parseRailwayErrorResponse(errorText, 500);
    const body = await res.json();
    expect(body.error).toBe("Something broke");
  });

  it("falls back to 'Processing failed' for non-JSON error text", async () => {
    const res = parseRailwayErrorResponse("raw error text", 500);
    const body = await res.json();
    expect(body.error).toBe("Processing failed: raw error text");
  });

  it("falls back to 'Processing failed' for object without known fields", async () => {
    const errorText = JSON.stringify({ unknown: true });
    const res = parseRailwayErrorResponse(errorText, 500);
    const body = await res.json();
    expect(body.error).toBe("Processing failed");
  });
});

// ── callRailwayWithRetry ─────────────────────────────────────────────────────

describe("callRailwayWithRetry", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("returns the response on first successful attempt", async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      3,
      "test"
    );

    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retries on ECONNRESET and succeeds", async () => {
    const econnresetError = new Error("ECONNRESET");
    const mockResponse = new Response("ok", { status: 200 });

    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(econnresetError)
      .mockResolvedValueOnce(mockResponse);

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      3,
      "test"
    );

    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("returns 504 on AbortError (timeout)", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    global.fetch = jest.fn().mockRejectedValue(abortError);

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      3,
      "test"
    );

    const body = await (result as Response).json();
    expect((result as Response).status).toBe(504);
    expect(body.error).toContain("timeout");
  });

  it("returns 503 after all retries fail with non-ECONNRESET error", async () => {
    const genericError = new Error("Network failed");
    global.fetch = jest.fn().mockRejectedValue(genericError);

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      2,
      "test"
    );

    const body = await (result as Response).json();
    expect((result as Response).status).toBe(503);
    expect(body.error).toContain("Failed to connect");
    // Non-ECONNRESET should not retry
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns 503 after exhausting ECONNRESET retries", async () => {
    const econnresetError = new Error("connect ECONNRESET");
    global.fetch = jest.fn().mockRejectedValue(econnresetError);

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      2,
      "test"
    );

    expect((result as Response).status).toBe(503);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("passes custom headers to fetch", async () => {
    const mockResponse = new Response("ok", { status: 200 });
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    await callRailwayWithRetry("https://example.com/api", "body", 1, "test", {
      "X-Custom": "value",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/api",
      expect.objectContaining({
        headers: { "X-Custom": "value" },
      })
    );
  });

  it("handles ECONNRESET via cause property", async () => {
    const causeError = new Error("fetch failed");
    (causeError as NodeJS.ErrnoException).cause = { code: "ECONNRESET" };
    const mockResponse = new Response("ok", { status: 200 });

    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(causeError)
      .mockResolvedValueOnce(mockResponse);

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await callRailwayWithRetry(
      "https://example.com/api",
      "body",
      3,
      "test"
    );

    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

// ── getVideoExtension ────────────────────────────────────────────────────────

describe("getVideoExtension", () => {
  it('returns ".webm" for video/webm', () => {
    expect(getVideoExtension("video/webm")).toBe(".webm");
  });

  it('returns ".mov" for video/quicktime', () => {
    expect(getVideoExtension("video/quicktime")).toBe(".mov");
  });

  it('returns ".mp4" for video/mp4', () => {
    expect(getVideoExtension("video/mp4")).toBe(".mp4");
  });

  it('returns ".mp4" for unknown types', () => {
    expect(getVideoExtension("video/x-msvideo")).toBe(".mp4");
  });
});

// ── buildTranscodeErrorResponse ──────────────────────────────────────────────

describe("buildTranscodeErrorResponse", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns OOM message for OOM errors", async () => {
    const res = buildTranscodeErrorResponse(new Error("OOM killed"), "test");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("resolution is too high");
  });

  it("returns OOM message for signal -9 errors", async () => {
    const res = buildTranscodeErrorResponse(
      new Error("Process exited with -9"),
      "test"
    );
    const body = await res.json();
    expect(body.error).toContain("resolution is too high");
  });

  it("returns OOM message for exit code 137", async () => {
    const res = buildTranscodeErrorResponse(new Error("Exit code 137"), "test");
    const body = await res.json();
    expect(body.error).toContain("resolution is too high");
  });

  it("returns generic transcode error for other errors", async () => {
    const res = buildTranscodeErrorResponse(new Error("Unknown codec"), "test");
    const body = await res.json();
    expect(body.error).toContain("Failed to convert video");
  });

  it("handles non-Error objects", async () => {
    const res = buildTranscodeErrorResponse("string error", "test");
    const body = await res.json();
    expect(body.error).toContain("Failed to convert video");
  });
});

// ── Constants ────────────────────────────────────────────────────────────────

describe("constants", () => {
  it("exports ALLOWED_VIDEO_TYPES", () => {
    expect(ALLOWED_VIDEO_TYPES).toContain("video/mp4");
    expect(ALLOWED_VIDEO_TYPES).toContain("video/quicktime");
    expect(ALLOWED_VIDEO_TYPES).toContain("video/webm");
    expect(ALLOWED_VIDEO_TYPES.length).toBeGreaterThanOrEqual(5);
  });

  it("exports MAX_VIDEO_BYTES as 500MB", () => {
    expect(MAX_VIDEO_BYTES).toBe(500 * 1024 * 1024);
  });
});
