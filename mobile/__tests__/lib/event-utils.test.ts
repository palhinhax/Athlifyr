import {
  getSportIcon,
  getSportColor,
  getPrimarySport,
  sportTypeIcons,
  sportTypeColors,
  SPORT_TYPES,
  formatDate,
  formatDateShort,
  formatDateRange,
} from "@/src/lib/event-utils";

// ── getSportIcon ──────────────────────────────────────────────────────────────

describe("getSportIcon", () => {
  it("returns correct icon for known sport types", () => {
    expect(getSportIcon("RUNNING")).toBe("🏃");
    expect(getSportIcon("TRAIL")).toBe("🥾");
    expect(getSportIcon("CYCLING")).toBe("🚴");
    expect(getSportIcon("SWIMMING")).toBe("🏊");
  });

  it("returns OTHER icon for unknown sport type", () => {
    expect(getSportIcon("UNKNOWN_SPORT")).toBe(sportTypeIcons.OTHER);
  });

  it("returns OTHER icon for empty string", () => {
    expect(getSportIcon("")).toBe(sportTypeIcons.OTHER);
  });
});

// ── getSportColor ─────────────────────────────────────────────────────────────

describe("getSportColor", () => {
  it("returns correct color for known sport types", () => {
    expect(getSportColor("RUNNING")).toBe("#3B82F6");
    expect(getSportColor("TRAIL")).toBe("#10B981");
    expect(getSportColor("HYROX")).toBe("#EF4444");
  });

  it("returns OTHER color for unknown sport type", () => {
    expect(getSportColor("NONEXISTENT")).toBe(sportTypeColors.OTHER);
  });
});

// ── getPrimarySport ───────────────────────────────────────────────────────────

describe("getPrimarySport", () => {
  it("returns first sport from array", () => {
    expect(getPrimarySport(["RUNNING", "TRAIL"])).toBe("RUNNING");
  });

  it("returns OTHER for empty array", () => {
    expect(getPrimarySport([])).toBe("OTHER");
  });

  it("returns single sport when array has one element", () => {
    expect(getPrimarySport(["CYCLING"])).toBe("CYCLING");
  });
});

// ── SPORT_TYPES ───────────────────────────────────────────────────────────────

describe("SPORT_TYPES", () => {
  it("contains all expected sport types", () => {
    expect(SPORT_TYPES).toContain("RUNNING");
    expect(SPORT_TYPES).toContain("TRAIL");
    expect(SPORT_TYPES).toContain("CYCLING");
    expect(SPORT_TYPES).toContain("SWIMMING");
    expect(SPORT_TYPES).toContain("OTHER");
  });

  it("has 12 sport types", () => {
    expect(SPORT_TYPES).toHaveLength(12);
  });
});

// ── formatDate ────────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("formats a date in English locale", () => {
    const result = formatDate(new Date("2026-01-15"), "en");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("defaults to English locale", () => {
    const result = formatDate(new Date("2026-06-01"));
    expect(result).toContain("2026");
  });
});

// ── formatDateShort ───────────────────────────────────────────────────────────

describe("formatDateShort", () => {
  it("formats a date with short month", () => {
    const result = formatDateShort(new Date("2026-01-15"), "en");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

// ── formatDateRange ───────────────────────────────────────────────────────────

describe("formatDateRange", () => {
  it("returns single date when no end date", () => {
    const result = formatDateRange("2026-01-15", null, "en");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("returns single date when start and end are the same day", () => {
    const result = formatDateRange("2026-01-15", "2026-01-15", "en");
    expect(result).toContain("15");
    expect(result).toContain("2026");
    expect(result).not.toContain("-");
  });

  it("handles same month range", () => {
    const result = formatDateRange("2026-01-10", "2026-01-12", "en");
    expect(result).toContain("10");
    expect(result).toContain("12");
    expect(result).toContain("-");
  });

  it("handles different month range in same year", () => {
    const result = formatDateRange("2026-01-30", "2026-02-03", "en");
    expect(result).toContain("30");
    expect(result).toContain("3");
    expect(result).toContain("-");
  });

  it("handles different year range", () => {
    const result = formatDateRange("2025-12-30", "2026-01-03", "en");
    expect(result).toContain("2025");
    expect(result).toContain("2026");
    expect(result).toContain("-");
  });

  it("accepts Date objects", () => {
    const result = formatDateRange(
      new Date("2026-03-01"),
      new Date("2026-03-02"),
      "en"
    );
    expect(result).toContain("1");
    expect(result).toContain("2");
  });
});
