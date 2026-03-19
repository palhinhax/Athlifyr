import {
  enqueueActivity,
  getPendingCount,
  flushPendingActivities,
} from "@/src/lib/activity-sync-queue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/src/lib/api";

jest.mock("@/src/lib/api", () => ({
  api: { post: jest.fn() },
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockApi = api as jest.Mocked<typeof api>;

const makePending = () => ({
  startedAt: 1000,
  finishedAt: 2000,
  durationMs: 1000,
  distanceM: 5000,
  avgPaceMinKm: 5.5,
  maxSpeedKmh: 12,
  elevationGainM: 100,
  elevationLossM: 50,
  track: [],
});

describe("enqueueActivity", () => {
  beforeEach(() => jest.clearAllMocks());

  it("adds activity to pending queue", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    await enqueueActivity(makePending());
    expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    const saved = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(saved).toHaveLength(1);
  });

  it("appends to existing queue", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([makePending()])
    );
    await enqueueActivity(makePending());
    const saved = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(saved).toHaveLength(2);
  });
});

describe("getPendingCount", () => {
  it("returns 0 for empty queue", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    expect(await getPendingCount()).toBe(0);
  });

  it("returns count of pending activities", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([makePending(), makePending()])
    );
    expect(await getPendingCount()).toBe(2);
  });
});

describe("flushPendingActivities", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 0 when no pending activities", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    expect(await flushPendingActivities()).toBe(0);
  });

  it("syncs all activities successfully", async () => {
    const pending = [makePending(), makePending()];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(pending));
    mockApi.post.mockResolvedValue({} as never);

    const synced = await flushPendingActivities();

    expect(synced).toBe(2);
    expect(mockApi.post).toHaveBeenCalledTimes(2);
    // Queue should be empty after flush
    const saved = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(saved).toHaveLength(0);
  });

  it("keeps failed activities in queue", async () => {
    const pending = [makePending(), makePending()];
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(pending));
    mockApi.post
      .mockResolvedValueOnce({} as never) // first succeeds
      .mockRejectedValueOnce(new Error("offline")); // second fails

    const synced = await flushPendingActivities();

    expect(synced).toBe(1);
    const saved = JSON.parse(
      mockAsyncStorage.setItem.mock.calls[0][1] as string
    );
    expect(saved).toHaveLength(1);
  });
});
