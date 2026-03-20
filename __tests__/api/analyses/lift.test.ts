/**
 * @jest-environment node
 */

import { POST, GET, DELETE } from "@/app/api/analyses/lift/route";

// Mock auth-utils
const mockGetAuthUser = jest.fn();
jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: (...args: unknown[]) => mockGetAuthUser(...args),
}));

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    liftAnalysisRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as unknown as {
  liftAnalysisRecord: {
    findUnique: jest.Mock;
    create: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
  };
};

// Mock B2
const mockUploadToB2 = jest.fn();
const mockDeleteFromB2ByName = jest.fn();
jest.mock("@/lib/b2-storage", () => ({
  uploadToB2: (...args: unknown[]) => mockUploadToB2(...args),
  deleteFromB2ByName: (...args: unknown[]) => mockDeleteFromB2ByName(...args),
}));

// Mock ffmpeg
jest.mock("@/lib/ffmpeg-utils", () => ({
  remuxMp4Faststart: jest.fn().mockRejectedValue(new Error("no ffmpeg")),
}));

describe("POST /api/analyses/lift", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/analyses/lift", {
      method: "POST",
      body: new FormData(),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when localId is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    const fd = new FormData();
    const req = new Request("http://localhost/api/analyses/lift", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("localId");
  });

  it("returns existing record on idempotent POST", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    const existingRecord = {
      id: "rec_1",
      videoUrl: "https://example.com/video.mp4",
      createdAt: new Date().toISOString(),
    };
    mockPrisma.liftAnalysisRecord.findUnique.mockResolvedValue(existingRecord);

    const fd = new FormData();
    fd.set("localId", "local_123");
    const req = new Request("http://localhost/api/analyses/lift", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("rec_1");
  });

  it("handles B2 URL via resolveVideoFromUrl with RegExp.exec", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    mockPrisma.liftAnalysisRecord.findUnique.mockResolvedValue(null);
    mockPrisma.liftAnalysisRecord.create.mockResolvedValue({
      id: "rec_2",
      videoUrl:
        "https://f000.backblazeb2.com/file/mybucket/analyses/lift_abc.mp4",
      createdAt: new Date().toISOString(),
    });

    const fd = new FormData();
    fd.set("localId", "local_456");
    fd.set(
      "videoUrl",
      "https://f000.backblazeb2.com/file/mybucket/analyses/lift_abc.mp4"
    );
    fd.set("analysisData", JSON.stringify({ test: true }));

    const req = new Request("http://localhost/api/analyses/lift", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe("rec_2");
    // Verifies the RegExp.exec path (B2 URL skips download)
    expect(mockUploadToB2).not.toHaveBeenCalled();
  });

  it("returns 400 when neither video nor videoUrl provided", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    mockPrisma.liftAnalysisRecord.findUnique.mockResolvedValue(null);

    const fd = new FormData();
    fd.set("localId", "local_789");

    const req = new Request("http://localhost/api/analyses/lift", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("video file or videoUrl");
  });
});

describe("GET /api/analyses/lift", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/analyses/lift");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns user analyses", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    mockPrisma.liftAnalysisRecord.findMany.mockResolvedValue([
      {
        id: "rec_1",
        localId: "l1",
        label: null,
        videoUrl: "url",
        createdAt: new Date(),
      },
    ]);
    const req = new Request("http://localhost/api/analyses/lift");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.analyses).toHaveLength(1);
  });
});

describe("DELETE /api/analyses/lift", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/analyses/lift", {
      method: "DELETE",
      body: JSON.stringify({ id: "rec_1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when id is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user_1" });
    const req = new Request("http://localhost/api/analyses/lift", {
      method: "DELETE",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
