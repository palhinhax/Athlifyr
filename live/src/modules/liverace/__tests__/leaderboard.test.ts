import { describe, it, expect, vi } from "vitest";

// Mock external dependencies that liverace.service imports
vi.mock("../../../plugins/redis.js", () => ({
  getRedis: vi.fn(),
  isRedisAvailable: vi.fn().mockReturnValue(false),
}));
vi.mock("../liverace.api.js", () => ({
  fetchLiveConfig: vi.fn(),
  updateLiveStatus: vi.fn(),
  verifyAthlete: vi.fn(),
  persistResults: vi.fn(),
  fetchFriendIds: vi.fn(),
}));

import {
  computeLeaderboard,
  filterLeaderboardForViewer,
  filterPositionsForViewer,
} from "../liverace.service.js";
import type {
  EventRoomState,
  AthleteState,
  LeaderboardEntry,
  AthletePositionUpdate,
} from "../liverace.types.js";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function makeAthlete(overrides: Partial<AthleteState>): AthleteState {
  return {
    userId: overrides.userId ?? "u1",
    name: overrides.name ?? "Athlete",
    image: null,
    variantId: overrides.variantId ?? "v1",
    variantName: overrides.variantName ?? "10K",
    bibNumber: overrides.bibNumber ?? null,
    status: overrides.status ?? "ACTIVE",
    visibility: overrides.visibility ?? "PUBLIC",
    currentPosition: null,
    lastUpdateAt: overrides.lastUpdateAt ?? Date.now(),
    personalStartTime: overrides.personalStartTime ?? null,
    wasInsideStartZone: false,
    distanceAlongRouteM: overrides.distanceAlongRouteM ?? 0,
    deviationM: 0,
    progressPercent: overrides.progressPercent ?? 0,
    consecutiveOffRouteCount: 0,
    checkpointsReached: overrides.checkpointsReached ?? [],
    lastCheckpointOrder: overrides.lastCheckpointOrder ?? 0,
    rank: 0,
    finishTimeMs: overrides.finishTimeMs ?? null,
  };
}

function makeRoom(athletes: AthleteState[]): EventRoomState {
  const athleteMap = new Map<string, AthleteState>();
  for (const a of athletes) {
    athleteMap.set(a.userId, a);
  }
  return {
    eventId: "evt-1",
    config: {} as EventRoomState["config"],
    status: "LIVE",
    raceStartTime: Date.now() - 3600_000,
    variantStartTimes: new Map(),
    athletes: athleteMap,
    spectatorCount: 0,
    routeHelpers: new Map(),
    variantStartTimers: new Map(),
    leaderboardInterval: null,
    positionInterval: null,
    inactivityCheckInterval: null,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Per-variant leaderboard ranking
// ────────────────────────────────────────────────────────────────────────────

describe("computeLeaderboard — per-variant ranking", () => {
  it("ranks athletes within their own variant, not globally", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        name: "Alice",
        variantId: "v1",
        variantName: "10K",
        distanceAlongRouteM: 5000,
      }),
      makeAthlete({
        userId: "u2",
        name: "Bob",
        variantId: "v1",
        variantName: "10K",
        distanceAlongRouteM: 3000,
      }),
      makeAthlete({
        userId: "u3",
        name: "Charlie",
        variantId: "v2",
        variantName: "50K",
        distanceAlongRouteM: 20000,
      }),
      makeAthlete({
        userId: "u4",
        name: "Diana",
        variantId: "v2",
        variantName: "50K",
        distanceAlongRouteM: 15000,
      }),
    ]);

    const entries = computeLeaderboard(room);

    // 10K variant
    const v1Entries = entries.filter((e) => e.variantId === "v1");
    expect(v1Entries).toHaveLength(2);
    const alice = v1Entries.find((e) => e.userId === "u1")!;
    const bob = v1Entries.find((e) => e.userId === "u2")!;
    expect(alice.rank).toBe(1);
    expect(bob.rank).toBe(2);

    // 50K variant
    const v2Entries = entries.filter((e) => e.variantId === "v2");
    expect(v2Entries).toHaveLength(2);
    const charlie = v2Entries.find((e) => e.userId === "u3")!;
    const diana = v2Entries.find((e) => e.userId === "u4")!;
    expect(charlie.rank).toBe(1);
    expect(diana.rank).toBe(2);
  });

  it("places finished athletes before active ones within the same variant", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        name: "Finished",
        variantId: "v1",
        status: "FINISHED",
        finishTimeMs: 3600_000,
        distanceAlongRouteM: 10000,
      }),
      makeAthlete({
        userId: "u2",
        name: "Still running",
        variantId: "v1",
        status: "ACTIVE",
        distanceAlongRouteM: 9500,
      }),
    ]);

    const entries = computeLeaderboard(room);
    const finished = entries.find((e) => e.userId === "u1")!;
    const active = entries.find((e) => e.userId === "u2")!;
    expect(finished.rank).toBe(1);
    expect(active.rank).toBe(2);
  });

  it("sorts finished athletes by finish time ascending", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        name: "Slow",
        variantId: "v1",
        status: "FINISHED",
        finishTimeMs: 7200_000,
        distanceAlongRouteM: 10000,
      }),
      makeAthlete({
        userId: "u2",
        name: "Fast",
        variantId: "v1",
        status: "FINISHED",
        finishTimeMs: 3600_000,
        distanceAlongRouteM: 10000,
      }),
    ]);

    const entries = computeLeaderboard(room);
    const fast = entries.find((e) => e.userId === "u2")!;
    const slow = entries.find((e) => e.userId === "u1")!;
    expect(fast.rank).toBe(1);
    expect(slow.rank).toBe(2);
  });

  it("computes time-based gap for finished athletes", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        variantId: "v1",
        status: "FINISHED",
        finishTimeMs: 3600_000, // 1:00:00
        distanceAlongRouteM: 10000,
      }),
      makeAthlete({
        userId: "u2",
        variantId: "v1",
        status: "FINISHED",
        finishTimeMs: 3683_000, // 1:01:23
        distanceAlongRouteM: 10000,
      }),
    ]);

    const entries = computeLeaderboard(room);
    const leader = entries.find((e) => e.userId === "u1")!;
    const second = entries.find((e) => e.userId === "u2")!;
    expect(leader.gap).toBeNull();
    expect(second.gap).toBe("+1:23");
  });

  it("computes distance-based gap for active athletes (km format)", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        variantId: "v1",
        distanceAlongRouteM: 5000,
      }),
      makeAthlete({
        userId: "u2",
        variantId: "v1",
        distanceAlongRouteM: 3500,
      }),
    ]);

    const entries = computeLeaderboard(room);
    const second = entries.find((e) => e.userId === "u2")!;
    expect(second.gap).toBe("+1.5km");
  });

  it("computes distance-based gap for active athletes (m format for < 1km)", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        variantId: "v1",
        distanceAlongRouteM: 5000,
      }),
      makeAthlete({
        userId: "u2",
        variantId: "v1",
        distanceAlongRouteM: 4600,
      }),
    ]);

    const entries = computeLeaderboard(room);
    const second = entries.find((e) => e.userId === "u2")!;
    expect(second.gap).toBe("+400m");
  });

  it("leader has null gap", () => {
    const room = makeRoom([
      makeAthlete({
        userId: "u1",
        variantId: "v1",
        distanceAlongRouteM: 5000,
      }),
    ]);

    const entries = computeLeaderboard(room);
    expect(entries[0].gap).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Visibility filtering — Leaderboard
// ────────────────────────────────────────────────────────────────────────────

describe("filterLeaderboardForViewer", () => {
  const entries: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: "public-user",
      name: "Public Alice",
      image: "alice.jpg",
      bibNumber: "001",
      variantId: "v1",
      variantName: "10K",
      status: "ACTIVE",
      visibility: "PUBLIC",
      distanceAlongRouteM: 5000,
      progressPercent: 50,
      lastCheckpointOrder: 1,
      lastCheckpointName: "CP1",
      finishTimeMs: null,
      personalStartTime: null,
      gap: null,
    },
    {
      rank: 2,
      userId: "friends-user",
      name: "Friends Bob",
      image: "bob.jpg",
      bibNumber: "002",
      variantId: "v1",
      variantName: "10K",
      status: "ACTIVE",
      visibility: "FRIENDS",
      distanceAlongRouteM: 4000,
      progressPercent: 40,
      lastCheckpointOrder: 1,
      lastCheckpointName: "CP1",
      finishTimeMs: null,
      personalStartTime: null,
      gap: "+1.0km",
    },
    {
      rank: 3,
      userId: "private-user",
      name: "Private Charlie",
      image: "charlie.jpg",
      bibNumber: "003",
      variantId: "v1",
      variantName: "10K",
      status: "ACTIVE",
      visibility: "ORGANIZER_ONLY",
      distanceAlongRouteM: 3000,
      progressPercent: 30,
      lastCheckpointOrder: 0,
      lastCheckpointName: null,
      finishTimeMs: null,
      personalStartTime: null,
      gap: "+2.0km",
    },
  ];

  it("organizer sees all entries unmodified", () => {
    const result = filterLeaderboardForViewer(
      entries,
      "organizer",
      new Set(),
      true
    );
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Public Alice");
    expect(result[1].name).toBe("Friends Bob");
    expect(result[2].name).toBe("Private Charlie");
  });

  it("stranger sees PUBLIC unmodified, FRIENDS/ORGANIZER_ONLY anonymized", () => {
    const result = filterLeaderboardForViewer(
      entries,
      "stranger",
      new Set(),
      false
    );
    expect(result).toHaveLength(3);
    // PUBLIC — visible
    expect(result[0].name).toBe("Public Alice");
    // FRIENDS — anonymized (not a friend)
    expect(result[1].name).toBeNull();
    expect(result[1].image).toBeNull();
    expect(result[1].bibNumber).toBeNull();
    // Rank and distance are preserved for leaderboard integrity
    expect(result[1].rank).toBe(2);
    expect(result[1].distanceAlongRouteM).toBe(4000);
    // ORGANIZER_ONLY — anonymized
    expect(result[2].name).toBeNull();
  });

  it("friend of FRIENDS-visibility athlete sees their info", () => {
    const result = filterLeaderboardForViewer(
      entries,
      "a-friend",
      new Set(["friends-user"]),
      false
    );
    expect(result[1].name).toBe("Friends Bob");
    // ORGANIZER_ONLY still hidden
    expect(result[2].name).toBeNull();
  });

  it("athlete always sees their own entry regardless of visibility", () => {
    const result = filterLeaderboardForViewer(
      entries,
      "private-user",
      new Set(),
      false
    );
    // Own entry — even though ORGANIZER_ONLY, they see themselves
    expect(result[2].name).toBe("Private Charlie");
    expect(result[2].image).toBe("charlie.jpg");
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Visibility filtering — Positions
// ────────────────────────────────────────────────────────────────────────────

describe("filterPositionsForViewer", () => {
  const positions: AthletePositionUpdate[] = [
    {
      userId: "public-user",
      name: "Public Alice",
      bibNumber: "001",
      lat: 40.0,
      lng: -8.0,
      status: "ACTIVE",
      visibility: "PUBLIC",
      distanceAlongRouteM: 5000,
      progressPercent: 50,
      rank: 1,
      deviationM: 5,
    },
    {
      userId: "friends-user",
      name: "Friends Bob",
      bibNumber: "002",
      lat: 40.001,
      lng: -8.0,
      status: "ACTIVE",
      visibility: "FRIENDS",
      distanceAlongRouteM: 4000,
      progressPercent: 40,
      rank: 2,
      deviationM: 10,
    },
    {
      userId: "private-user",
      name: "Private Charlie",
      bibNumber: "003",
      lat: 40.002,
      lng: -8.0,
      status: "ACTIVE",
      visibility: "ORGANIZER_ONLY",
      distanceAlongRouteM: 3000,
      progressPercent: 30,
      rank: 3,
      deviationM: 2,
    },
  ];

  it("organizer sees all positions", () => {
    const result = filterPositionsForViewer(
      positions,
      "organizer",
      new Set(),
      true
    );
    expect(result).toHaveLength(3);
  });

  it("stranger only sees PUBLIC positions (no GPS leak for hidden athletes)", () => {
    const result = filterPositionsForViewer(
      positions,
      "stranger",
      new Set(),
      false
    );
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe("public-user");
  });

  it("friend sees PUBLIC + FRIENDS positions", () => {
    const result = filterPositionsForViewer(
      positions,
      "a-friend",
      new Set(["friends-user"]),
      false
    );
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.userId).sort()).toEqual([
      "friends-user",
      "public-user",
    ]);
  });

  it("athlete sees their own position even if ORGANIZER_ONLY", () => {
    const result = filterPositionsForViewer(
      positions,
      "private-user",
      new Set(),
      false
    );
    // Should see PUBLIC + own
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.userId).sort()).toEqual([
      "private-user",
      "public-user",
    ]);
  });

  it("unauthenticated viewer (no userId) only sees PUBLIC", () => {
    const result = filterPositionsForViewer(
      positions,
      undefined,
      new Set(),
      false
    );
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe("public-user");
  });
});
