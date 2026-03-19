import {
  formatDistance,
  formatDuration,
  formatPace,
  generateDefaultTitle,
} from "@/src/components/save-activity/save-activity.utils";

describe("formatDistance", () => {
  it("formats meters under 1km", () => {
    expect(formatDistance(500)).toBe("500m");
  });

  it("formats kilometers", () => {
    expect(formatDistance(5000)).toBe("5.00 km");
  });

  it("formats fractional km", () => {
    expect(formatDistance(10500)).toBe("10.50 km");
  });

  it("handles zero", () => {
    expect(formatDistance(0)).toBe("0m");
  });
});

describe("formatDuration", () => {
  it("formats seconds only", () => {
    expect(formatDuration(30000)).toBe("00:00:30");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(90000)).toBe("00:01:30");
  });

  it("formats hours", () => {
    expect(formatDuration(3661000)).toBe("01:01:01");
  });

  it("formats zero", () => {
    expect(formatDuration(0)).toBe("00:00:00");
  });
});

describe("formatPace", () => {
  it("formats whole minutes", () => {
    expect(formatPace(5.0)).toBe("5:00");
  });

  it("formats minutes with seconds", () => {
    expect(formatPace(5.5)).toBe("5:30");
  });

  it("pads single-digit seconds", () => {
    expect(formatPace(4.083)).toBe("4:05");
  });
});

describe("generateDefaultTitle", () => {
  const t = (key: string) => key;

  it("returns night run for early morning (before 6)", () => {
    const timestamp = new Date("2025-06-01T03:00:00").getTime();
    expect(generateDefaultTitle(t, timestamp)).toBe("saveActivity.nightRun");
  });

  it("returns morning run for 6-12", () => {
    const timestamp = new Date("2025-06-01T08:00:00").getTime();
    expect(generateDefaultTitle(t, timestamp)).toBe("saveActivity.morningRun");
  });

  it("returns afternoon run for 12-17", () => {
    const timestamp = new Date("2025-06-01T14:00:00").getTime();
    expect(generateDefaultTitle(t, timestamp)).toBe(
      "saveActivity.afternoonRun"
    );
  });

  it("returns evening run for 17-21", () => {
    const timestamp = new Date("2025-06-01T19:00:00").getTime();
    expect(generateDefaultTitle(t, timestamp)).toBe("saveActivity.eveningRun");
  });

  it("returns night run for after 21", () => {
    const timestamp = new Date("2025-06-01T22:00:00").getTime();
    expect(generateDefaultTitle(t, timestamp)).toBe("saveActivity.nightRun");
  });
});
