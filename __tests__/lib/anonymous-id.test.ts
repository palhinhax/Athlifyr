/**
 * @jest-environment jsdom
 */
import { getAnonymousId, clearAnonymousId } from "@/lib/anonymous-id";

const STORAGE_KEY = "athlifyr_anonymous_id";

// Mock crypto.randomUUID
const mockUUID = "test-uuid-1234-5678-abcd";
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => mockUUID },
});

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("getAnonymousId", () => {
  it("creates and stores a new ID when none exists", () => {
    const id = getAnonymousId();
    expect(id).toBe(mockUUID);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(mockUUID);
  });

  it("returns existing ID from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "existing-id");
    const id = getAnonymousId();
    expect(id).toBe("existing-id");
  });

  it("falls back to generated ID on localStorage error", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const id = getAnonymousId();

    expect(id).toBe(mockUUID);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error managing anonymous ID:",
      expect.any(Error)
    );
  });
});

describe("clearAnonymousId", () => {
  it("removes the ID from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "to-remove");
    clearAnonymousId();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("handles localStorage error gracefully", () => {
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    clearAnonymousId();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error clearing anonymous ID:",
      expect.any(Error)
    );
  });
});
