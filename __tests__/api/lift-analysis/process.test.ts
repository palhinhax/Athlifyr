/**
 * @jest-environment node
 */

import { POST } from "@/app/api/lift-analysis/process/route";
import { NextResponse } from "next/server";

// Mock all external dependencies
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/ai-rate-limit", () => ({
  checkAiRateLimit: jest.fn(),
  recordAiUsage: jest.fn(),
}));

jest.mock("@/lib/ffmpeg-utils", () => ({
  transcodeToH264: jest.fn(),
  trimVideoStreamCopy: jest.fn(),
}));

jest.mock("@/lib/analysis-transforms", () => {
  const actual = jest.requireActual("@/lib/analysis-transforms");
  return {
    ...actual,
    trimAndTranscodeVideo: jest.fn(),
    resolveAiPermission: jest.fn(),
    callRailwayWithRetry: jest.fn(),
  };
});

const { trimAndTranscodeVideo, resolveAiPermission, callRailwayWithRetry } =
  jest.requireMock<{
    trimAndTranscodeVideo: jest.Mock;
    resolveAiPermission: jest.Mock;
    callRailwayWithRetry: jest.Mock;
  }>("@/lib/analysis-transforms");

function makeVideoFile(): File {
  return new File([new ArrayBuffer(100)], "test.mp4", { type: "video/mp4" });
}

function makeFormDataRequest(
  overrides?: Record<string, string | File>
): Request {
  const fd = new FormData();
  fd.set("video", makeVideoFile());
  fd.set("seed_x", "100");
  fd.set("seed_y", "200");
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) fd.set(k, v);
  }

  return new Request("http://localhost/api/lift-analysis/process", {
    method: "POST",
    body: fd,
  });
}

describe("POST /api/lift-analysis/process", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when video file is missing", async () => {
    const fd = new FormData();
    fd.set("seed_x", "100");
    fd.set("seed_y", "200");
    const req = new Request("http://localhost/api/lift-analysis/process", {
      method: "POST",
      body: fd,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("video file is required");
  });

  it("returns 400 when seed_x is missing", async () => {
    const fd = new FormData();
    fd.set("video", makeVideoFile());
    fd.set("seed_y", "200");
    const req = new Request("http://localhost/api/lift-analysis/process", {
      method: "POST",
      body: fd,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("seed_x and seed_y are required");
  });

  it("returns 400 when seed_x is not a valid number", async () => {
    const fd = new FormData();
    fd.set("video", makeVideoFile());
    fd.set("seed_x", "abc");
    fd.set("seed_y", "200");
    const req = new Request("http://localhost/api/lift-analysis/process", {
      method: "POST",
      body: fd,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("seed_x and seed_y must be valid numbers");
  });

  it("returns 400 when video type is unsupported", async () => {
    const fd = new FormData();
    fd.set(
      "video",
      new File([new ArrayBuffer(10)], "test.txt", { type: "text/plain" })
    );
    fd.set("seed_x", "100");
    fd.set("seed_y", "200");
    const req = new Request("http://localhost/api/lift-analysis/process", {
      method: "POST",
      body: fd,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Only mp4");
  });

  it("calls trimAndTranscodeVideo with LiftAnalysis tag", async () => {
    const videoFile = makeVideoFile();
    trimAndTranscodeVideo.mockResolvedValue(videoFile);
    resolveAiPermission.mockResolvedValue(false);
    callRailwayWithRetry.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "ok",
          tracking_success: true,
          frames_processed: 10,
          frames_with_pose: 8,
          pose_detection_rate: 0.8,
          duration_sec: 5,
        }),
        { status: 200 }
      )
    );

    await POST(makeFormDataRequest());
    expect(trimAndTranscodeVideo).toHaveBeenCalledWith(
      expect.any(File),
      expect.any(FormData),
      "LiftAnalysis"
    );
  });

  it("calls resolveAiPermission with LiftAnalysis tag", async () => {
    const videoFile = makeVideoFile();
    trimAndTranscodeVideo.mockResolvedValue(videoFile);
    resolveAiPermission.mockResolvedValue(false);
    callRailwayWithRetry.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "ok",
          tracking_success: true,
          frames_processed: 10,
          frames_with_pose: 8,
          pose_detection_rate: 0.8,
          duration_sec: 5,
        }),
        { status: 200 }
      )
    );

    await POST(makeFormDataRequest());
    expect(resolveAiPermission).toHaveBeenCalledWith(
      expect.any(FormData),
      expect.any(FormData),
      "LiftAnalysis"
    );
  });

  it("returns trimAndTranscodeVideo error when processing fails", async () => {
    trimAndTranscodeVideo.mockResolvedValue(
      NextResponse.json({ error: "Transcode failed" }, { status: 400 })
    );

    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(400);
  });

  it("returns 400 when formData parsing fails", async () => {
    const req = new Request("http://localhost/api/lift-analysis/process", {
      method: "POST",
      body: "not multipart data",
      headers: { "Content-Type": "text/plain" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid multipart body");
  });

  it("returns callRailwayWithRetry error when API call fails", async () => {
    trimAndTranscodeVideo.mockResolvedValue(makeVideoFile());
    resolveAiPermission.mockResolvedValue(false);
    callRailwayWithRetry.mockResolvedValue(
      NextResponse.json({ error: "Connection failed" }, { status: 503 })
    );

    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(503);
  });
});
