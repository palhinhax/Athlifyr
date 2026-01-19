import { formatDateRange } from "@/lib/event-utils";

describe("event-utils", () => {
  describe("formatDateRange", () => {
    describe("single day events", () => {
      it("should format single day event in English", () => {
        const date = new Date("2026-01-15");
        expect(formatDateRange(date, null, "en")).toBe("Jan 15, 2026");
      });

      it("should format single day event in Portuguese", () => {
        const date = new Date("2026-01-15");
        expect(formatDateRange(date, null, "pt")).toBe("15 de jan. de 2026");
      });

      it("should format single day when start equals end", () => {
        const date = new Date("2026-01-15");
        expect(formatDateRange(date, date, "en")).toBe("Jan 15, 2026");
      });
    });

    describe("multi-day events - same month", () => {
      it("should format same month range in English", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "en")).toBe("1 - 2 Jan 2026");
      });

      it("should format same month range in Portuguese", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "pt")).toBe("1 - 2 jan. de 2026");
      });

      it("should format same month range in Spanish", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "es")).toBe("1 - 2 ene 2026");
      });

      it("should format same month range in French", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "fr")).toBe("1 - 2 janv. 2026");
      });

      it("should format same month range in German", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "de")).toBe("1 - 2 Jan. 2026");
      });

      it("should format same month range in Italian", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-02");
        expect(formatDateRange(start, end, "it")).toBe("1 - 2 gen 2026");
      });
    });

    describe("multi-day events - different months, same year", () => {
      it("should format different months in English", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "en")).toBe("Jan 30 - Feb 3 2026");
      });

      it("should format different months in Portuguese", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "pt")).toBe(
          "30 de jan. - 3 de fev. 2026"
        );
      });

      it("should format different months in Spanish", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "es")).toBe("30 ene - 3 feb 2026");
      });

      it("should format different months in French", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "fr")).toBe(
          "30 janv. - 3 févr. 2026"
        );
      });

      it("should format different months in German", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "de")).toBe(
          "30. Jan. - 3. Feb. 2026"
        );
      });

      it("should format different months in Italian", () => {
        const start = new Date("2026-01-30");
        const end = new Date("2026-02-03");
        expect(formatDateRange(start, end, "it")).toBe("30 gen - 3 feb 2026");
      });
    });

    describe("multi-day events - different years", () => {
      it("should format different years in English", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "en")).toBe(
          "Dec 30, 2025 - Jan 3, 2026"
        );
      });

      it("should format different years in Portuguese", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "pt")).toBe(
          "30 de dez. de 2025 - 3 de jan. de 2026"
        );
      });

      it("should format different years in Spanish", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "es")).toBe(
          "30 dic 2025 - 3 ene 2026"
        );
      });

      it("should format different years in French", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "fr")).toBe(
          "30 déc. 2025 - 3 janv. 2026"
        );
      });

      it("should format different years in German", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "de")).toBe(
          "30. Dez. 2025 - 3. Jan. 2026"
        );
      });

      it("should format different years in Italian", () => {
        const start = new Date("2025-12-30");
        const end = new Date("2026-01-03");
        expect(formatDateRange(start, end, "it")).toBe(
          "30 dic 2025 - 3 gen 2026"
        );
      });
    });
  });
});
