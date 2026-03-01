import {
  escapeCSVField,
  needsQuoting,
  buildCSVRow,
  buildCSV,
  formatCentsDecimal,
  formatDateISO,
  buildExportFilename,
} from "@/lib/csv-export";

describe("CSV Export Utilities", () => {
  describe("escapeCSVField", () => {
    it("wraps a plain value in double-quotes", () => {
      expect(escapeCSVField("hello")).toBe('"hello"');
    });

    it("doubles internal double-quotes", () => {
      expect(escapeCSVField('say "hi"')).toBe('"say ""hi"""');
    });

    it("handles commas inside the value", () => {
      expect(escapeCSVField("a,b")).toBe('"a,b"');
    });

    it("handles newlines inside the value", () => {
      expect(escapeCSVField("line1\nline2")).toBe('"line1\nline2"');
    });

    it("handles carriage returns inside the value", () => {
      expect(escapeCSVField("line1\r\nline2")).toBe('"line1\r\nline2"');
    });

    it("handles empty string", () => {
      expect(escapeCSVField("")).toBe('""');
    });

    it("handles diacritics / unicode", () => {
      expect(escapeCSVField("José García")).toBe('"José García"');
    });

    it("handles leading/trailing whitespace", () => {
      expect(escapeCSVField("  hello  ")).toBe('"  hello  "');
    });
  });

  describe("needsQuoting", () => {
    it("returns true when value contains comma", () => {
      expect(needsQuoting("a,b")).toBe(true);
    });

    it("returns true when value contains double-quote", () => {
      expect(needsQuoting('say "hi"')).toBe(true);
    });

    it("returns true when value contains newline", () => {
      expect(needsQuoting("a\nb")).toBe(true);
    });

    it("returns true when value contains carriage return", () => {
      expect(needsQuoting("a\rb")).toBe(true);
    });

    it("returns false for plain text", () => {
      expect(needsQuoting("hello")).toBe(false);
    });
  });

  describe("buildCSVRow", () => {
    it("builds a CRLF-terminated row with escaped fields", () => {
      const row = buildCSVRow(["Name", "Email", "Status"]);
      expect(row).toBe('"Name","Email","Status"\r\n');
    });

    it("escapes fields that contain special characters", () => {
      const row = buildCSVRow(["O'Brien, John", 'say "hi"']);
      expect(row).toBe('"O\'Brien, John","say ""hi"""\r\n');
    });

    it("handles empty cells", () => {
      const row = buildCSVRow(["", "", ""]);
      expect(row).toBe('"","",""\r\n');
    });
  });

  describe("buildCSV", () => {
    it("includes UTF-8 BOM at the start", () => {
      const csv = buildCSV(["A"], [["1"]]);
      expect(csv.charCodeAt(0)).toBe(0xfeff);
    });

    it("builds header + data rows with CRLF endings", () => {
      const csv = buildCSV(
        ["Name", "Age"],
        [
          ["Alice", "30"],
          ["Bob", "25"],
        ]
      );
      const lines = csv.slice(1).split("\r\n"); // skip BOM
      expect(lines[0]).toBe('"Name","Age"');
      expect(lines[1]).toBe('"Alice","30"');
      expect(lines[2]).toBe('"Bob","25"');
    });

    it("handles empty data", () => {
      const csv = buildCSV(["Col1"], []);
      expect(csv).toBe("\uFEFF" + '"Col1"\r\n');
    });
  });

  describe("formatCentsDecimal", () => {
    it("converts cents to decimal string", () => {
      expect(formatCentsDecimal(1050)).toBe("10.50");
    });

    it("handles zero", () => {
      expect(formatCentsDecimal(0)).toBe("0.00");
    });

    it("handles large amounts", () => {
      expect(formatCentsDecimal(100000)).toBe("1000.00");
    });

    it("handles single-digit cents", () => {
      expect(formatCentsDecimal(5)).toBe("0.05");
    });
  });

  describe("formatDateISO", () => {
    it("formats a Date object to ISO-8601", () => {
      const date = new Date("2025-06-15T10:30:00.000Z");
      expect(formatDateISO(date)).toBe("2025-06-15T10:30:00.000Z");
    });

    it("formats a date string to ISO-8601", () => {
      expect(formatDateISO("2025-06-15T10:30:00.000Z")).toBe(
        "2025-06-15T10:30:00.000Z"
      );
    });

    it("returns empty string for null", () => {
      expect(formatDateISO(null)).toBe("");
    });
  });

  describe("buildExportFilename", () => {
    it("generates filename with event slug", () => {
      const filename = buildExportFilename("trail-manuelino-2026");
      expect(filename).toMatch(
        /^athlifyr-registrations-trail-manuelino-2026-\d{4}-\d{2}-\d{2}\.csv$/
      );
    });

    it("generates filename with event + variant slug", () => {
      const filename = buildExportFilename("trail-manuelino-2026", "Trail 32K");
      expect(filename).toMatch(
        /^athlifyr-registrations-trail-manuelino-2026-trail-32k-\d{4}-\d{2}-\d{2}\.csv$/
      );
    });

    it("sanitizes special characters from slugs", () => {
      const filename = buildExportFilename("Trail Manuelino 2026!");
      expect(filename).toMatch(
        /^athlifyr-registrations-trail-manuelino-2026-\d{4}-\d{2}-\d{2}\.csv$/
      );
    });

    it("omits variant when null", () => {
      const filename = buildExportFilename("my-event", null);
      expect(filename).not.toContain("null");
    });
  });
});
