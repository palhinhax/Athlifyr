import {
  formatTime,
  formatPace,
  parseTimeToSeconds,
} from "@/src/hooks/usePerformance";

describe("formatTime", () => {
  it("formats seconds only (under 1 minute)", () => {
    expect(formatTime(45)).toBe("0:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(125)).toBe("2:05");
  });

  it("formats hours, minutes, and seconds", () => {
    expect(formatTime(3661)).toBe("1:01:01");
  });

  it("formats zero seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("pads single-digit seconds", () => {
    expect(formatTime(63)).toBe("1:03");
  });

  it("pads single-digit minutes in hour format", () => {
    expect(formatTime(3605)).toBe("1:00:05");
  });

  it("handles exactly one hour", () => {
    expect(formatTime(3600)).toBe("1:00:00");
  });

  it("handles large values (marathon time ~4h)", () => {
    const fourHours = 4 * 3600 + 15 * 60 + 30;
    expect(formatTime(fourHours)).toBe("4:15:30");
  });
});

describe("formatPace", () => {
  it("formats pace in minutes:seconds per km", () => {
    expect(formatPace(300)).toBe("5:00");
  });

  it("formats pace with seconds", () => {
    expect(formatPace(330)).toBe("5:30");
  });

  it("pads single-digit seconds", () => {
    expect(formatPace(245)).toBe("4:05");
  });

  it("formats fast pace", () => {
    expect(formatPace(180)).toBe("3:00");
  });

  it("formats slow pace", () => {
    expect(formatPace(480)).toBe("8:00");
  });
});

describe("parseTimeToSeconds", () => {
  it("parses mm:ss format", () => {
    expect(parseTimeToSeconds("5:30")).toBe(330);
  });

  it("parses hh:mm:ss format", () => {
    expect(parseTimeToSeconds("1:30:00")).toBe(5400);
  });

  it("parses zero values", () => {
    expect(parseTimeToSeconds("0:00")).toBe(0);
  });

  it("returns null for invalid input (non-numeric)", () => {
    expect(parseTimeToSeconds("abc")).toBeNull();
  });

  it("returns null for single value", () => {
    expect(parseTimeToSeconds("123")).toBeNull();
  });

  it("treats empty string parts as zero (edge case)", () => {
    // "::" splits to ["", "", ""], Number("") is 0, so returns 0
    expect(parseTimeToSeconds("::")).toBe(0);
  });

  it("returns null for four-part time", () => {
    expect(parseTimeToSeconds("1:2:3:4")).toBeNull();
  });

  it("handles large hour values", () => {
    expect(parseTimeToSeconds("10:30:45")).toBe(37845);
  });

  it("returns null for partially invalid input", () => {
    expect(parseTimeToSeconds("5:ab")).toBeNull();
  });
});
