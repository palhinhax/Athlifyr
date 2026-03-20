/**
 * @jest-environment node
 */

import { getUserAnalyses } from "@/lib/athli-ai/analyses";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    motionAnalysisRecord: { findMany: jest.fn() },
    liftAnalysisRecord: { findMany: jest.fn() },
  },
}));

const mockMotionFind = prisma.motionAnalysisRecord.findMany as jest.Mock;
const mockLiftFind = prisma.liftAnalysisRecord.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";

const makeMotionRecord = (overrides = {}) => ({
  id: "m1",
  label: "Squat check",
  createdAt: new Date("2025-03-15"),
  analysisJson: {
    metrics: { kneeFlexionDeg: 90, torsoRangeDeg: 30 },
    pose: { averageAngles: { knee: 90 }, durationSec: 45 },
    aiAnalysis: {
      exercise: "Squat",
      exerciseEn: "Squat",
      confidence: 0.95,
      totalReps: 10,
      durationSec: 30,
      tempoAvgSec: 3,
      overallScore: 85,
      overallNotes: "Solid form",
      strengths: ["depth"],
      improvements: ["tempo"],
      safetyFlags: [],
    },
  },
  ...overrides,
});

const makeLiftRecord = (overrides = {}) => ({
  id: "l1",
  label: "Deadlift bar path",
  createdAt: new Date("2025-03-14"),
  analysisJson: {
    durationMs: 5000,
    pose: { averageAngles: { hip: 160 } },
    metrics: {
      maxHorizontalDrift: 3.2,
      totalVerticalTravel: 120,
      averageSpeed: 0.8,
    },
    aiAnalysis: {
      exercise: "Deadlift",
      exerciseEn: "Deadlift",
      confidence: 0.9,
      totalReps: 5,
      durationSec: null,
      tempoAvgSec: null,
      overallScore: 78,
      overallNotes: "Good path",
      strengths: ["lockout"],
      improvements: ["drift"],
      safetyFlags: ["back rounding"],
    },
  },
  ...overrides,
});

describe("getUserAnalyses", () => {
  it("returns both motion and lift analyses sorted by date", async () => {
    mockMotionFind.mockResolvedValue([makeMotionRecord()]);
    mockLiftFind.mockResolvedValue([makeLiftRecord()]);

    const result = JSON.parse(await getUserAnalyses(userId, {}));

    expect(result.total).toBe(2);
    // motion (2025-03-15) comes before lift (2025-03-14) — descending
    expect(result.analyses[0].type).toBe("motion");
    expect(result.analyses[1].type).toBe("lift");
  });

  it("returns only motion when type=motion", async () => {
    mockMotionFind.mockResolvedValue([makeMotionRecord()]);

    const result = JSON.parse(
      await getUserAnalyses(userId, { type: "motion" })
    );

    expect(mockLiftFind).not.toHaveBeenCalled();
    expect(result.analyses).toHaveLength(1);
    expect(result.analyses[0].type).toBe("motion");
    expect(result.analyses[0].overallScore).toBe(85);
    expect(result.analyses[0].averageAngles).toEqual({
      kneeFlexion: 90,
      torsoRange: 30,
    });
  });

  it("returns only lift when type=lift", async () => {
    mockLiftFind.mockResolvedValue([makeLiftRecord()]);

    const result = JSON.parse(await getUserAnalyses(userId, { type: "lift" }));

    expect(mockMotionFind).not.toHaveBeenCalled();
    expect(result.analyses).toHaveLength(1);
    expect(result.analyses[0].type).toBe("lift");
    expect(result.analyses[0].liftMetrics).toEqual({
      maxHorizontalDrift: 3.2,
      totalVerticalTravel: 120,
      averageSpeed: 0.8,
    });
  });

  it("returns no-data message when empty", async () => {
    mockMotionFind.mockResolvedValue([]);
    mockLiftFind.mockResolvedValue([]);

    const result = await getUserAnalyses(userId, {});

    expect(result).toContain("No analyses found");
  });

  it("handles motion record without aiAnalysis", async () => {
    mockMotionFind.mockResolvedValue([
      makeMotionRecord({
        analysisJson: {
          metrics: null,
          pose: null,
          aiAnalysis: null,
        },
      }),
    ]);
    mockLiftFind.mockResolvedValue([]);

    const result = JSON.parse(await getUserAnalyses(userId, {}));

    expect(result.analyses[0].exercise).toBeNull();
    expect(result.analyses[0].overallScore).toBeNull();
    expect(result.analyses[0].averageAngles).toBeNull();
  });

  it("uses duration from pose when aiAnalysis durationSec is null", async () => {
    mockMotionFind.mockResolvedValue([
      makeMotionRecord({
        analysisJson: {
          metrics: null,
          pose: { durationSec: 60, averageAngles: null },
          aiAnalysis: {
            exercise: "Run",
            exerciseEn: null,
            confidence: 0.5,
            totalReps: null,
            durationSec: null,
            tempoAvgSec: null,
            overallScore: null,
            overallNotes: null,
            strengths: [],
            improvements: [],
            safetyFlags: [],
          },
        },
      }),
    ]);
    mockLiftFind.mockResolvedValue([]);

    const result = JSON.parse(await getUserAnalyses(userId, {}));

    expect(result.analyses[0].durationSec).toBe(60);
  });

  it("uses durationMs from lift record when aiAnalysis durationSec is null", async () => {
    mockLiftFind.mockResolvedValue([
      makeLiftRecord({
        analysisJson: {
          durationMs: 10000,
          pose: { averageAngles: null },
          metrics: null,
          aiAnalysis: {
            exercise: "Clean",
            exerciseEn: null,
            confidence: 0.5,
            totalReps: 3,
            durationSec: null,
            tempoAvgSec: null,
            overallScore: 70,
            overallNotes: null,
            strengths: [],
            improvements: [],
            safetyFlags: [],
          },
        },
      }),
    ]);
    mockMotionFind.mockResolvedValue([]);

    const result = JSON.parse(await getUserAnalyses(userId, { type: "lift" }));

    expect(result.analyses[0].durationSec).toBe(10);
    expect(result.analyses[0].liftMetrics).toBeUndefined();
  });

  it("respects limit parameter", async () => {
    mockMotionFind.mockResolvedValue([]);
    mockLiftFind.mockResolvedValue([]);

    await getUserAnalyses(userId, { limit: 5 });

    expect(mockMotionFind).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
    expect(mockLiftFind).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  it("uses exerciseEn when exercise is null in motion", async () => {
    mockMotionFind.mockResolvedValue([
      makeMotionRecord({
        analysisJson: {
          metrics: null,
          pose: null,
          aiAnalysis: {
            exercise: null,
            exerciseEn: "Push Up",
            confidence: 0.8,
            totalReps: 5,
            durationSec: 20,
            tempoAvgSec: null,
            overallScore: 60,
            overallNotes: null,
            strengths: [],
            improvements: [],
            safetyFlags: [],
          },
        },
      }),
    ]);
    mockLiftFind.mockResolvedValue([]);

    const result = JSON.parse(await getUserAnalyses(userId, {}));
    expect(result.analyses[0].exercise).toBe("Push Up");
  });
});
