/**
 * @jest-environment node
 */

import { logPerformanceEntry } from "@/lib/athli-ai/performance-log";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    exercise: { findFirst: jest.fn() },
    userPerformanceEntry: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockExerciseFindFirst = prisma.exercise.findFirst as jest.Mock;
const mockEntryFindFirst = prisma.userPerformanceEntry.findFirst as jest.Mock;
const mockEntryCreate = prisma.userPerformanceEntry.create as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";

// ── STRENGTH ──────────────────────────────────────────────────────────────────

describe("logPerformanceEntry — STRENGTH", () => {
  it("returns error when exerciseName is missing", async () => {
    const result = JSON.parse(
      await logPerformanceEntry(userId, { type: "STRENGTH", weightKg: 100 })
    );
    expect(result.error).toBe(true);
    expect(result.message).toContain("Exercise name is required");
  });

  it("returns error when weightKg is missing", async () => {
    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "STRENGTH",
        exerciseName: "Deadlift",
      })
    );
    expect(result.error).toBe(true);
    expect(result.message).toContain("Weight in kg is required");
  });

  it("returns error when weightKg is 0", async () => {
    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "STRENGTH",
        exerciseName: "Deadlift",
        weightKg: 0,
      })
    );
    expect(result.error).toBe(true);
  });

  it("returns error when exercise not found", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "STRENGTH",
        exerciseName: "FakeExercise",
        weightKg: 100,
      })
    );
    expect(result.error).toBe(true);
    expect(result.message).toContain("not found");
  });

  it("logs a new PR when no previous best", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1", name: "Deadlift" });
    mockEntryFindFirst.mockResolvedValue(null);
    mockEntryCreate.mockResolvedValue({ id: "entry-1" });

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "STRENGTH",
        exerciseName: "Deadlift",
        weightKg: 120,
        reps: 3,
      })
    );

    expect(result.success).toBe(true);
    expect(result.isNewPR).toBe(true);
    expect(result.exercise).toBe("Deadlift");
    expect(result.message).toContain("NEW PR");
  });

  it("logs non-PR when previous best is higher", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1", name: "Deadlift" });
    mockEntryFindFirst.mockResolvedValue({
      weightKg: 150,
      reps: 1,
      performedAt: new Date("2025-01-01"),
    });
    mockEntryCreate.mockResolvedValue({ id: "entry-2" });

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "STRENGTH",
        exerciseName: "Deadlift",
        weightKg: 100,
        reps: 3,
      })
    );

    expect(result.success).toBe(true);
    expect(result.isNewPR).toBe(false);
    expect(result.previousBest).toBeDefined();
    expect(result.message).toContain("Recorded");
  });

  it("defaults reps to 1 when not provided", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1", name: "Squat" });
    mockEntryFindFirst.mockResolvedValue(null);
    mockEntryCreate.mockResolvedValue({ id: "entry-3" });

    await logPerformanceEntry(userId, {
      type: "STRENGTH",
      exerciseName: "Squat",
      weightKg: 100,
    });

    expect(mockEntryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ reps: 1 }),
    });
  });

  it("uses provided date", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1", name: "Press" });
    mockEntryFindFirst.mockResolvedValue(null);
    mockEntryCreate.mockResolvedValue({ id: "entry-4" });

    await logPerformanceEntry(userId, {
      type: "STRENGTH",
      exerciseName: "Press",
      weightKg: 60,
      date: "2025-06-15",
    });

    const createData = mockEntryCreate.mock.calls[0][0].data;
    expect(createData.performedAt).toEqual(new Date("2025-06-15"));
  });
});

// ── RUN / TRAIL ───────────────────────────────────────────────────────────────

describe("logPerformanceEntry — RUN", () => {
  it("returns error when distanceKm is missing", async () => {
    const result = JSON.parse(
      await logPerformanceEntry(userId, { type: "RUN" })
    );
    expect(result.error).toBe(true);
    expect(result.message).toContain("Distance in km is required");
  });

  it("logs a run entry", async () => {
    mockEntryCreate.mockResolvedValue({ id: "entry-r1" });

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "RUN",
        distanceKm: 10,
        timeSeconds: 2700,
        eventName: "Parkrun",
        location: "Porto",
      })
    );

    expect(result.success).toBe(true);
    expect(result.distanceKm).toBe(10);
    expect(result.timeFormatted).toBe("45m00s");
    expect(result.message).toContain("run");
    expect(result.message).toContain("10km");
  });

  it("logs a run without time", async () => {
    mockEntryCreate.mockResolvedValue({ id: "entry-r2" });

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "RUN",
        distanceKm: 5,
      })
    );

    expect(result.success).toBe(true);
    expect(result.timeFormatted).toBeNull();
  });
});

describe("logPerformanceEntry — TRAIL", () => {
  it("logs a trail entry with elevation", async () => {
    mockEntryCreate.mockResolvedValue({ id: "entry-t1" });

    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "TRAIL",
        distanceKm: 25,
        timeSeconds: 12600,
        elevationGainM: 1200,
      })
    );

    expect(result.success).toBe(true);
    expect(result.type).toBe("TRAIL");
    expect(result.elevationGainM).toBe(1200);
    expect(result.timeFormatted).toBe("3h30m00s");
    expect(result.message).toContain("trail");
  });
});

// ── INVALID TYPE ──────────────────────────────────────────────────────────────

describe("logPerformanceEntry — invalid type", () => {
  it("returns error for unknown type", async () => {
    const result = JSON.parse(
      await logPerformanceEntry(userId, {
        type: "INVALID" as "STRENGTH",
      })
    );
    expect(result.error).toBe(true);
    expect(result.message).toContain("Invalid type");
  });
});
