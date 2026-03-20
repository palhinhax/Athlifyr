/**
 * @jest-environment node
 */

import { POST } from "@/app/api/lift-analysis/process-b2/route";
import { NextResponse } from "next/server";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/ai-rate-limit", () => ({
  checkAiRateLimit: jest.fn(),
  recordAiUsage: jest.fn(),
}));

jest.mock("@/lib/b2-s3", () => ({
  createPresignedDownloadUrl: jest.fn(),
  createPresignedResultUploadUrl: jest.fn(),
  getB2PublicUrl: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/analysis-transforms", () => ({
  transformSkeletonFrames: jest.fn().mockReturnValue([]),
  transformAiAnalysis: jest.fn().mockReturnValue(null),
  transformAverageAngles: jest.fn().mockReturnValue(null),
  parseRailwayErrorResponse: jest.fn(),
  callRailwayWithRetry: jest.fn(),
}));

const { getAuthUser } = jest.requireMock<{
  getAuthUser: jest.Mock;
}>("@/lib/auth-utils");

const { checkAiRateLimit, recordAiUsage } = jest.requireMock<{
  checkAiRateLimit: jest.Mock;
  recordAiUsage: jest.Mock;
}>("@/lib/ai-rate-limit");

const {
  createPresignedDownloadUrl,
  createPresignedResultUploadUrl,
  getB2PublicUrl,
} = jest.requireMock<{
  createPresignedDownloadUrl: jest.Mock;
  createPresignedResultUploadUrl: jest.Mock;
  getB2PublicUrl: jest.Mock;
}>("@/lib/b2-s3");

const { callRailwayWithRetry, parseRailwayErrorResponse, transformAiAnalysis } =
  jest.requireMock<{
    callRailwayWithRetry: jest.Mock;
    parseRailwayErrorResponse: jest.Mock;
    transformAiAnalysis: jest.Mock;
  }>("@/lib/analysis-transforms");

// ── Helpers ────────────────────────────────────────────────────────────────

const USER_ID = "user_123";

function makeJsonRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/lift-analysis/process-b2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeValidBody(overrides: Record<string, unknown> = {}) {
  return {
    key: `uploads/${USER_ID}/video.mp4`,
    contentType: "video/mp4",
    seed_x: 0.5,
    seed_y: 0.4,
    ...overrides,
  };
}

function mockSuccessfulRailwayResponse(
  overrides: Record<string, unknown> = {}
) {
  const railwayResponse = {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => ({
      success: true,
      message: "Processing complete",
      video_uploaded_to_b2: true,
      tracking_success: true,
      auto_detected: true,
      detected_center_x: 0.5,
      detected_center_y: 0.4,
      detected_radius: 10,
      total_travel_px: 500,
      max_vertical_displacement_px: 200,
      max_horizontal_displacement_px: 50,
      frames_processed: 100,
      frames_with_pose: 90,
      pose_detection_rate: 0.9,
      duration_sec: 5.2,
      average_angles: null,
      skeleton_frames: [],
      ai_analysis: null,
      ...overrides,
    }),
  };
  callRailwayWithRetry.mockResolvedValue(railwayResponse);
  return railwayResponse;
}

function setupDefaultMocks() {
  getAuthUser.mockResolvedValue({ id: USER_ID });
  createPresignedDownloadUrl.mockResolvedValue(
    "https://b2.example.com/download"
  );
  createPresignedResultUploadUrl.mockResolvedValue({
    uploadUrl: "https://b2.example.com/upload",
    key: "results/user_123/result.mp4",
  });
  getB2PublicUrl.mockReturnValue(
    "https://b2.example.com/public/results/user_123/result.mp4"
  );
  checkAiRateLimit.mockResolvedValue({ allowed: true });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/lift-analysis/process-b2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    setupDefaultMocks();
  });

  // ── Auth ──────────────────────────────────────────────────────────────────

  it("returns 401 when user is not authenticated", async () => {
    getAuthUser.mockResolvedValue(null);
    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 when user has no id", async () => {
    getAuthUser.mockResolvedValue({ id: undefined });
    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(401);
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it("returns 400 when key is missing", async () => {
    const res = await POST(makeJsonRequest(makeValidBody({ key: "" })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("key and contentType are required");
  });

  it("returns 400 when contentType is missing", async () => {
    const res = await POST(makeJsonRequest(makeValidBody({ contentType: "" })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("key and contentType are required");
  });

  it("returns 403 when key does not belong to user", async () => {
    const res = await POST(
      makeJsonRequest(makeValidBody({ key: "uploads/other-user/video.mp4" }))
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("does not belong to you");
  });

  it("returns 400 when seed_x is missing", async () => {
    const res = await POST(
      makeJsonRequest(makeValidBody({ seed_x: undefined }))
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("seed_x and seed_y are required");
  });

  it("returns 400 when seed_y is missing", async () => {
    const res = await POST(
      makeJsonRequest(makeValidBody({ seed_y: undefined }))
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("seed_x and seed_y are required");
  });

  it("returns 400 when seed_x is not a valid number", async () => {
    const res = await POST(makeJsonRequest(makeValidBody({ seed_x: NaN })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("must be valid numbers");
  });

  it("returns 400 when seed_y is Infinity", async () => {
    const res = await POST(
      makeJsonRequest(makeValidBody({ seed_y: Infinity }))
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("must be valid numbers");
  });

  // ── AI rate limiting ──────────────────────────────────────────────────────

  it("enables AI when rate limit allows", async () => {
    checkAiRateLimit.mockResolvedValue({ allowed: true });
    mockSuccessfulRailwayResponse();

    await POST(makeJsonRequest(makeValidBody({ enable_ai: true })));

    const payload = JSON.parse(callRailwayWithRetry.mock.calls[0][1]);
    expect(payload.enable_ai).toBe(true);
  });

  it("disables AI when rate limited", async () => {
    checkAiRateLimit.mockResolvedValue({
      allowed: false,
      nextAvailableAt: new Date(),
    });
    mockSuccessfulRailwayResponse();

    await POST(makeJsonRequest(makeValidBody({ enable_ai: true })));

    const payload = JSON.parse(callRailwayWithRetry.mock.calls[0][1]);
    expect(payload.enable_ai).toBe(false);
  });

  it("disables AI when enable_ai is false", async () => {
    mockSuccessfulRailwayResponse();

    await POST(makeJsonRequest(makeValidBody({ enable_ai: false })));

    const payload = JSON.parse(callRailwayWithRetry.mock.calls[0][1]);
    expect(payload.enable_ai).toBe(false);
    expect(checkAiRateLimit).not.toHaveBeenCalled();
  });

  // ── Railway call ──────────────────────────────────────────────────────────

  it("passes correct payload to Railway", async () => {
    mockSuccessfulRailwayResponse();

    await POST(
      makeJsonRequest(
        makeValidBody({
          seed_frame: 5,
          show_angles: false,
          show_body: false,
          max_duration_sec: 20,
          auto_detect: false,
          language: "pt",
          trim_start_sec: 2,
          trim_end_sec: 10,
        })
      )
    );

    const payload = JSON.parse(callRailwayWithRetry.mock.calls[0][1]);
    expect(payload.video_url).toBe("https://b2.example.com/download");
    expect(payload.seed_frame).toBe(5);
    expect(payload.show_angles).toBe(false);
    expect(payload.show_body).toBe(false);
    expect(payload.max_duration_sec).toBe(20);
    expect(payload.auto_detect).toBe(false);
    expect(payload.language).toBe("pt");
    expect(payload.trim_start_sec).toBe(2);
    expect(payload.trim_end_sec).toBe(10);
    expect(payload.result_upload_url).toBe("https://b2.example.com/upload");
  });

  it("uses default values for optional fields", async () => {
    mockSuccessfulRailwayResponse();

    await POST(makeJsonRequest(makeValidBody()));

    const payload = JSON.parse(callRailwayWithRetry.mock.calls[0][1]);
    expect(payload.seed_frame).toBe(0);
    expect(payload.show_angles).toBe(true);
    expect(payload.show_body).toBe(true);
    expect(payload.auto_detect).toBe(true);
    expect(payload.language).toBe("en");
    expect(payload.trim_start_sec).toBeNull();
    expect(payload.trim_end_sec).toBeNull();
  });

  it("returns early when callRailwayWithRetry returns a NextResponse", async () => {
    const errorResponse = NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
    callRailwayWithRetry.mockResolvedValue(errorResponse);

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(503);
  });

  // ── Railway error responses ───────────────────────────────────────────────

  it("handles non-ok Railway response", async () => {
    const errorNextResponse = NextResponse.json(
      { error: "Railway failed" },
      { status: 502 }
    );
    parseRailwayErrorResponse.mockReturnValue(errorNextResponse);
    callRailwayWithRetry.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: async () => "Railway error detail",
    });

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(502);
    expect(parseRailwayErrorResponse).toHaveBeenCalledWith(
      "Railway error detail",
      502
    );
  });

  it("handles Railway success=false response", async () => {
    callRailwayWithRetry.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        success: false,
        error: "Processing failed",
        message: "Bad video",
        frames_processed: 0,
        frames_with_pose: 0,
        pose_detection_rate: 0,
        duration_sec: 0,
        tracking_success: false,
      }),
    });

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Processing failed");
  });

  it("uses message as fallback when error is empty", async () => {
    callRailwayWithRetry.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        success: false,
        message: "Something went wrong",
        frames_processed: 0,
        frames_with_pose: 0,
        pose_detection_rate: 0,
        duration_sec: 0,
        tracking_success: false,
      }),
    });

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Something went wrong");
  });

  // ── Successful response ───────────────────────────────────────────────────

  it("returns success response with B2 video URL", async () => {
    mockSuccessfulRailwayResponse({ video_uploaded_to_b2: true });

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.videoUrl).toBe(
      "https://b2.example.com/public/results/user_123/result.mp4"
    );
    expect(body.tracking.success).toBe(true);
    expect(body.tracking.autoDetected).toBe(true);
    expect(body.pose.framesProcessed).toBe(100);
    expect(body.pose.framesWithPose).toBe(90);
    expect(body.pose.detectionRate).toBe(0.9);
    expect(body.pose.durationSec).toBe(5.2);
  });

  it("returns Railway video URL when not uploaded to B2", async () => {
    mockSuccessfulRailwayResponse({
      video_uploaded_to_b2: false,
      video_url: "/results/some-video.mp4",
    });

    const res = await POST(makeJsonRequest(makeValidBody()));
    const body = await res.json();
    expect(body.videoUrl).toContain("/results/some-video.mp4");
  });

  it("returns null videoUrl when neither B2 nor Railway URL available", async () => {
    mockSuccessfulRailwayResponse({
      video_uploaded_to_b2: false,
      video_url: undefined,
    });

    const res = await POST(makeJsonRequest(makeValidBody()));
    const body = await res.json();
    expect(body.videoUrl).toBeNull();
  });

  it("records AI usage when AI analysis is returned", async () => {
    checkAiRateLimit.mockResolvedValue({ allowed: true });
    transformAiAnalysis.mockReturnValue({
      liftType: "squat",
      summary: "Good form",
      strengths: ["Deep squat"],
      areasForImprovement: ["Bar path"],
      recommendations: ["Focus on bracing"],
      score: 8,
    });
    callRailwayWithRetry.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        success: true,
        message: "Done",
        video_uploaded_to_b2: true,
        tracking_success: true,
        frames_processed: 50,
        frames_with_pose: 45,
        pose_detection_rate: 0.9,
        duration_sec: 3,
        skeleton_frames: [],
        ai_analysis: {
          lift_type: "squat",
          summary: "Good form",
          strengths: ["Deep squat"],
          areas_for_improvement: ["Bar path"],
          recommendations: ["Focus on bracing"],
          score: 8,
        },
      }),
    });

    await POST(makeJsonRequest(makeValidBody({ enable_ai: true })));

    expect(recordAiUsage).toHaveBeenCalledWith(USER_ID, "lift");
  });

  it("does not record AI usage when AI is disabled", async () => {
    mockSuccessfulRailwayResponse();

    await POST(makeJsonRequest(makeValidBody({ enable_ai: false })));

    expect(recordAiUsage).not.toHaveBeenCalled();
  });

  // ── Unexpected errors ─────────────────────────────────────────────────────

  it("returns 500 on unexpected error", async () => {
    getAuthUser.mockRejectedValue(new Error("DB connection lost"));

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Video processing failed");
  });

  it("handles non-Error thrown values", async () => {
    getAuthUser.mockRejectedValue("some string error");

    const res = await POST(makeJsonRequest(makeValidBody()));
    expect(res.status).toBe(500);
  });
});
