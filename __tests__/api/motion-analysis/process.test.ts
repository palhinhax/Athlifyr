/**
 * @jest-environment node
 */

import { POST } from "@/app/api/motion-analysis/process/route";
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
  };
});

const { trimAndTranscodeVideo, resolveAiPermission } = jest.requireMock<{
  trimAndTranscodeVideo: jest.Mock;
  resolveAiPermission: jest.Mock;
}>("@/lib/analysis-transforms");

function makeVideoFile(): File {
  return new File([new ArrayBuffer(100)], "test.mp4", { type: "video/mp4" });
}

function makeFormDataRequest(fields?: Record<string, string | File>): Request {
  const fd = new FormData();
  fd.set("video", makeVideoFile());
  if (fields) {
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  }

  return new Request("http://localhost/api/motion-analysis/process", {
    method: "POST",
    body: fd,
  });
}

describe("POST /api/motion-analysis/process", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when video file is missing", async () => {
    const fd = new FormData();
    const req = new Request("http://localhost/api/motion-analysis/process", {
      method: "POST",
      body: fd,
    });

    trimAndTranscodeVideo.mockResolvedValue(makeVideoFile());
    resolveAiPermission.mockResolvedValue(false);

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("video file is required");
  });

  it("returns 400 when video type is unsupported", async () => {
    const fd = new FormData();
    fd.set(
      "video",
      new File([new ArrayBuffer(10)], "test.txt", { type: "text/plain" })
    );
    const req = new Request("http://localhost/api/motion-analysis/process", {
      method: "POST",
      body: fd,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Only mp4");
  });

  it("calls trimAndTranscodeVideo with MotionAnalysis tag", async () => {
    const videoFile = makeVideoFile();
    trimAndTranscodeVideo.mockResolvedValue(videoFile);
    resolveAiPermission.mockResolvedValue(false);

    // Mock the external fetch to avoid real HTTP calls
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "ok",
          frames_processed: 10,
          frames_with_pose: 8,
          pose_detection_rate: 0.8,
          duration_sec: 5,
        }),
        { status: 200 }
      )
    );

    try {
      await POST(makeFormDataRequest());
      expect(trimAndTranscodeVideo).toHaveBeenCalledWith(
        expect.any(File),
        expect.any(FormData),
        "MotionAnalysis"
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("calls resolveAiPermission with MotionAnalysis tag", async () => {
    const videoFile = makeVideoFile();
    trimAndTranscodeVideo.mockResolvedValue(videoFile);
    resolveAiPermission.mockResolvedValue(false);

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "ok",
          frames_processed: 10,
          frames_with_pose: 8,
          pose_detection_rate: 0.8,
          duration_sec: 5,
        }),
        { status: 200 }
      )
    );

    try {
      await POST(makeFormDataRequest());
      expect(resolveAiPermission).toHaveBeenCalledWith(
        expect.any(FormData),
        expect.any(FormData),
        "MotionAnalysis"
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("returns trimAndTranscodeVideo error when video processing fails", async () => {
    trimAndTranscodeVideo.mockResolvedValue(
      NextResponse.json({ error: "Transcode failed" }, { status: 400 })
    );

    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(400);
  });

  it("returns 400 when formData parsing fails", async () => {
    const req = new Request("http://localhost/api/motion-analysis/process", {
      method: "POST",
      body: "not multipart data",
      headers: { "Content-Type": "text/plain" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid multipart body");
  });
});
