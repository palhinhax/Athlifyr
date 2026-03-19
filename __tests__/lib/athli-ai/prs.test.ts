/**
 * @jest-environment node
 */

import { getUserPRs, formatSecondsToTime } from "@/lib/athli-ai/prs";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    userPerformanceEntry: { findMany: jest.fn() },
    exercise: { findFirst: jest.fn() },
    workoutExerciseSet: { findMany: jest.fn() },
  },
}));

const mockEntryFindMany = prisma.userPerformanceEntry.findMany as jest.Mock;
const mockExerciseFindFirst = prisma.exercise.findFirst as jest.Mock;
const mockSetFindMany = prisma.workoutExerciseSet.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";

// ── formatSecondsToTime ───────────────────────────────────────────────────────

describe("formatSecondsToTime", () => {
  it("returns null for null input", () => {
    expect(formatSecondsToTime(null)).toBeNull();
  });

  it("returns null for 0", () => {
    expect(formatSecondsToTime(0)).toBeNull();
  });

  it("formats minutes and seconds", () => {
    expect(formatSecondsToTime(125)).toBe("2m05s");
  });

  it("formats hours, minutes and seconds", () => {
    expect(formatSecondsToTime(3661)).toBe("1h01m01s");
  });

  it("formats exact minutes", () => {
    expect(formatSecondsToTime(120)).toBe("2m00s");
  });
});

// ── RUN records ───────────────────────────────────────────────────────────────

describe("getUserPRs — RUN", () => {
  it("returns run records with best times", async () => {
    mockEntryFindMany.mockResolvedValue([
      {
        type: "RUN",
        performedAt: new Date("2025-03-01"),
        distanceKm: 10,
        timeSeconds: 2700,
        elevationGainM: null,
        eventName: "Parkrun",
        location: "Porto",
      },
      {
        type: "RUN",
        performedAt: new Date("2025-02-15"),
        distanceKm: 10,
        timeSeconds: 2800,
        elevationGainM: null,
        eventName: null,
        location: null,
      },
    ]);

    const result = JSON.parse(await getUserPRs(userId, { type: "RUN" }));

    expect(result.type).toBe("RUN");
    expect(result.totalEntries).toBe(2);
    expect(result.bestTimes).toHaveLength(1);
    expect(result.bestTimes[0].distanceKm).toBe(10);
    expect(result.bestTimes[0].bestTime).toBe("45m00s");
  });

  it("returns empty message for no run records", async () => {
    mockEntryFindMany.mockResolvedValue([]);

    const result = JSON.parse(await getUserPRs(userId, { type: "RUN" }));

    expect(result.message).toContain("No running records");
    expect(result.entries).toEqual([]);
  });
});

// ── TRAIL records ─────────────────────────────────────────────────────────────

describe("getUserPRs — TRAIL", () => {
  it("returns trail records", async () => {
    mockEntryFindMany.mockResolvedValue([
      {
        type: "TRAIL",
        performedAt: new Date("2025-03-01"),
        distanceKm: 25,
        timeSeconds: 12600,
        elevationGainM: 1200,
        eventName: "Trail X",
        location: "Serra",
      },
    ]);

    const result = JSON.parse(await getUserPRs(userId, { type: "TRAIL" }));

    expect(result.type).toBe("TRAIL");
    expect(result.entries[0].elevationGainM).toBe(1200);
  });

  it("returns empty message for no trail records", async () => {
    mockEntryFindMany.mockResolvedValue([]);

    const result = JSON.parse(await getUserPRs(userId, { type: "TRAIL" }));

    expect(result.message).toContain("No trail records");
  });
});

// ── HYROX records ─────────────────────────────────────────────────────────────

describe("getUserPRs — HYROX", () => {
  it("returns hyrox records", async () => {
    mockEntryFindMany.mockResolvedValue([
      {
        type: "HYROX",
        performedAt: new Date("2025-02-01"),
        timeSeconds: 4200,
        hyroxCategory: "OPEN",
        eventName: "HYROX Lisbon",
        location: "Lisbon",
      },
    ]);

    const result = JSON.parse(await getUserPRs(userId, { type: "HYROX" }));

    expect(result.type).toBe("HYROX");
    expect(result.entries[0].time).toBe("1h10m00s");
    expect(result.entries[0].category).toBe("OPEN");
  });

  it("returns empty message for no hyrox records", async () => {
    mockEntryFindMany.mockResolvedValue([]);

    const result = JSON.parse(await getUserPRs(userId, { type: "HYROX" }));

    expect(result.message).toContain("No HYROX records");
  });
});

// ── STRENGTH by exercise ──────────────────────────────────────────────────────

describe("getUserPRs — STRENGTH with exerciseName", () => {
  it("returns PR for specific exercise", async () => {
    mockExerciseFindFirst.mockResolvedValue({
      id: "ex1",
      name: "Back Squat",
      category: "WEIGHTLIFTING",
    });
    mockEntryFindMany.mockResolvedValue([
      {
        weightKg: 120,
        reps: 3,
        performedAt: new Date("2025-03-01"),
        exercise: { id: "ex1", name: "Back Squat", category: "WEIGHTLIFTING" },
      },
    ]);
    mockSetFindMany.mockResolvedValue([]);

    const result = JSON.parse(
      await getUserPRs(userId, { exerciseName: "Back Squat" })
    );

    expect(result.exercise).toBe("Back Squat");
    expect(result.pr.weightKg).toBe(120);
  });

  it("returns error when exercise not found", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);

    const result = await getUserPRs(userId, { exerciseName: "FakeExercise" });

    expect(result).toContain("not found");
  });

  it("returns no PR message when no entries", async () => {
    mockExerciseFindFirst.mockResolvedValue({
      id: "ex1",
      name: "Deadlift",
      category: "WEIGHTLIFTING",
    });
    mockEntryFindMany.mockResolvedValue([]);
    mockSetFindMany.mockResolvedValue([]);

    const result = JSON.parse(
      await getUserPRs(userId, { exerciseName: "Deadlift" })
    );

    expect(result.pr).toBeNull();
    expect(result.message).toContain("No personal records");
  });

  it("merges workout sets with performance entries", async () => {
    mockExerciseFindFirst.mockResolvedValue({
      id: "ex1",
      name: "Bench Press",
      category: "GYM",
    });
    mockEntryFindMany.mockResolvedValue([
      {
        weightKg: 80,
        reps: 5,
        performedAt: new Date("2025-02-01"),
        exercise: { id: "ex1", name: "Bench Press", category: "GYM" },
      },
    ]);
    mockSetFindMany.mockResolvedValue([
      {
        weight: 85,
        reps: 3,
        exerciseResult: {
          blockResult: {
            log: { performedAt: new Date("2025-03-01") },
          },
        },
      },
    ]);

    const result = JSON.parse(
      await getUserPRs(userId, { exerciseName: "Bench Press" })
    );

    expect(result.pr.weightKg).toBe(85);
    expect(result.recentHistory).toHaveLength(2);
  });
});

// ── ALL records ───────────────────────────────────────────────────────────────

describe("getUserPRs — all records", () => {
  it("returns all types of records", async () => {
    // Strength entries
    mockEntryFindMany
      .mockResolvedValueOnce([
        {
          weightKg: 100,
          reps: 1,
          performedAt: new Date("2025-03-01"),
          exercise: { id: "ex1", name: "Deadlift", category: "WEIGHTLIFTING" },
        },
      ])
      // Run entries
      .mockResolvedValueOnce([
        {
          type: "RUN",
          performedAt: new Date("2025-03-01"),
          distanceKm: 5,
          timeSeconds: 1500,
          elevationGainM: null,
          eventName: null,
          location: null,
        },
      ])
      // Hyrox entries
      .mockResolvedValueOnce([]);

    const result = JSON.parse(await getUserPRs(userId, {}));

    expect(result.strengthPRs).toBeDefined();
    expect(result.strengthPRs.prs[0].name).toBe("Deadlift");
    expect(result.runRecords).toBeDefined();
    expect(result.hyroxRecords).toBeNull();
  });

  it("returns no records message when all empty", async () => {
    mockEntryFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await getUserPRs(userId, {});

    expect(result).toContain("No performance records found");
  });

  it("filters strength by category", async () => {
    mockEntryFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await getUserPRs(userId, { category: "GYM" });

    const firstCall = mockEntryFindMany.mock.calls[0][0];
    expect(firstCall.where.exercise).toEqual({
      category: "GYM",
    });
  });
});
