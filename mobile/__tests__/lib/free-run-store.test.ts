import {
  loadActivities,
  saveActivity,
  deleteActivity,
  getActivity,
  exportGPX,
} from "@/src/lib/free-run-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FreeRunActivity } from "@/src/lib/free-run-store";

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const makeActivity = (
  id: string,
  overrides?: Partial<FreeRunActivity>
): FreeRunActivity => ({
  id,
  startedAt: 1000,
  finishedAt: 2000,
  durationMs: 1000,
  distanceM: 5000,
  avgPaceMinKm: 5.5,
  maxSpeedKmh: 12,
  elevationGainM: 100,
  elevationLossM: 50,
  track: [],
  ...overrides,
});

beforeEach(() => jest.clearAllMocks());

describe("loadActivities", () => {
  it("returns empty array when no stored data", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    const result = await loadActivities();
    expect(result).toEqual([]);
  });

  it("parses stored JSON", async () => {
    const activities = [makeActivity("1"), makeActivity("2")];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(activities));
    const result = await loadActivities();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
  });
});

describe("saveActivity", () => {
  it("prepends activity and saves to storage", async () => {
    const existing = [makeActivity("old")];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing));

    await saveActivity(makeActivity("new"));

    expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    const savedData = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(savedData[0].id).toBe("new");
    expect(savedData[1].id).toBe("old");
  });

  it("trims to 100 activities max", async () => {
    const existing = Array.from({ length: 100 }, (_, i) =>
      makeActivity(`act-${i}`)
    );
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing));

    await saveActivity(makeActivity("newest"));

    const savedData = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(savedData).toHaveLength(100);
    expect(savedData[0].id).toBe("newest");
  });
});

describe("deleteActivity", () => {
  it("removes activity by id", async () => {
    const activities = [makeActivity("keep"), makeActivity("remove")];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(activities));

    await deleteActivity("remove");

    const savedData = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(savedData).toHaveLength(1);
    expect(savedData[0].id).toBe("keep");
  });
});

describe("getActivity", () => {
  it("returns activity by id", async () => {
    const activities = [makeActivity("a"), makeActivity("b")];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(activities));

    const result = await getActivity("b");
    expect(result).not.toBeNull();
    expect(result!.id).toBe("b");
  });

  it("returns null when not found", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const result = await getActivity("missing");
    expect(result).toBeNull();
  });
});

describe("exportGPX", () => {
  it("generates valid GPX XML", () => {
    const activity = makeActivity("gpx-test", {
      startedAt: new Date("2025-06-01T10:00:00Z").getTime(),
      track: [
        { lat: 38.7, lng: -9.14, timestamp: 1000, altitude: 50 },
        { lat: 38.71, lng: -9.13, timestamp: 2000 },
      ],
    });

    const gpx = exportGPX(activity);
    expect(gpx).toContain('<?xml version="1.0"');
    expect(gpx).toContain("<gpx");
    expect(gpx).toContain("Athlifyr");
    expect(gpx).toContain('<trkpt lat="38.7" lon="-9.14"');
    expect(gpx).toContain("<ele>50.0</ele>");
    expect(gpx).toContain('<trkpt lat="38.71" lon="-9.13"');
  });

  it("omits elevation when not available", () => {
    const activity = makeActivity("no-ele", {
      track: [{ lat: 38.7, lng: -9.14, timestamp: 1000 }],
    });
    const gpx = exportGPX(activity);
    expect(gpx).not.toContain("<ele>");
  });
});
