import {
  getPrimaryService,
  getVenueColor,
  getVenueEmoji,
  createVenueMarkerHtml,
  getVenueBadgeStyle,
  getServiceIcon,
  SERVICE_COLORS,
  SERVICE_EMOJIS,
} from "@/lib/venue-icons";

describe("venue-icons", () => {
  // ─── getPrimaryService ───────────────────────────────────────────────

  describe("getPrimaryService", () => {
    it("returns DEFAULT when services is undefined", () => {
      expect(getPrimaryService(undefined)).toBe("DEFAULT");
    });

    it("returns DEFAULT when services is null", () => {
      expect(getPrimaryService(null)).toBe("DEFAULT");
    });

    it("returns DEFAULT when services is empty", () => {
      expect(getPrimaryService([])).toBe("DEFAULT");
    });

    it("returns the single service when only one is provided", () => {
      expect(getPrimaryService(["YOGA"])).toBe("YOGA");
    });

    it("returns highest priority service from multiple", () => {
      expect(getPrimaryService(["YOGA", "MMA", "OPEN_GYM"])).toBe("MMA");
    });

    it("prioritises combat sports over everything else", () => {
      expect(getPrimaryService(["CROSSFIT", "MMA"])).toBe("MMA");
      expect(getPrimaryService(["POWERLIFTING", "BJJ"])).toBe("BJJ");
    });

    it("prioritises CrossFit over strength sports", () => {
      expect(getPrimaryService(["WEIGHTLIFTING", "CROSSFIT"])).toBe("CROSSFIT");
    });

    it("treats unknown services as priority 0", () => {
      expect(getPrimaryService(["UNKNOWN_SERVICE", "YOGA"])).toBe("YOGA");
    });

    it("returns first unknown when all are unknown (stable sort)", () => {
      const result = getPrimaryService(["ALPHA", "BETA"]);
      // Both have priority 0 — stable sort keeps original order
      expect(result).toBe("ALPHA");
    });
  });

  // ─── getVenueColor ──────────────────────────────────────────────────

  describe("getVenueColor", () => {
    it("returns DEFAULT color when services is undefined", () => {
      expect(getVenueColor(undefined)).toEqual(SERVICE_COLORS.DEFAULT);
    });

    it("returns DEFAULT color when services is null", () => {
      expect(getVenueColor(null)).toEqual(SERVICE_COLORS.DEFAULT);
    });

    it("returns correct color for a known service", () => {
      expect(getVenueColor(["MMA"])).toEqual(SERVICE_COLORS.MMA);
    });

    it("picks highest priority service color", () => {
      expect(getVenueColor(["YOGA", "CROSSFIT"])).toEqual(
        SERVICE_COLORS.CROSSFIT
      );
    });

    it("falls back to DEFAULT for unknown services", () => {
      expect(getVenueColor(["SOME_UNKNOWN"])).toEqual(SERVICE_COLORS.DEFAULT);
    });
  });

  // ─── getVenueEmoji ──────────────────────────────────────────────────

  describe("getVenueEmoji", () => {
    it("returns DEFAULT emoji when services is undefined", () => {
      expect(getVenueEmoji(undefined)).toBe(SERVICE_EMOJIS.DEFAULT);
    });

    it("returns DEFAULT emoji when services is null", () => {
      expect(getVenueEmoji(null)).toBe(SERVICE_EMOJIS.DEFAULT);
    });

    it("returns correct emoji for a known service", () => {
      expect(getVenueEmoji(["BJJ"])).toBe("🥋");
    });

    it("picks highest priority service emoji", () => {
      expect(getVenueEmoji(["PILATES", "BOXING"])).toBe(SERVICE_EMOJIS.BOXING);
    });

    it("falls back to DEFAULT emoji for unknown services", () => {
      expect(getVenueEmoji(["NONEXISTENT"])).toBe(SERVICE_EMOJIS.DEFAULT);
    });
  });

  // ─── createVenueMarkerHtml ──────────────────────────────────────────

  describe("createVenueMarkerHtml", () => {
    it("returns an HTML string with default size 40", () => {
      const html = createVenueMarkerHtml(["MMA"]);
      expect(html).toContain("width: 40px");
      expect(html).toContain("height: 40px");
      expect(html).toContain(SERVICE_COLORS.MMA.bg);
      expect(html).toContain(SERVICE_EMOJIS.MMA);
    });

    it("respects custom size parameter", () => {
      const html = createVenueMarkerHtml(["YOGA"], 28);
      expect(html).toContain("width: 28px");
      expect(html).toContain("height: 28px");
      // fontSize = round(28 * 0.45) = 13
      expect(html).toContain("font-size: 13px");
      // borderWidth for size < 36 = 2
      expect(html).toContain("border: 2px solid");
    });

    it("uses thicker border for size >= 36", () => {
      const html = createVenueMarkerHtml(["YOGA"], 48);
      expect(html).toContain("border: 3px solid");
    });

    it("handles undefined services gracefully", () => {
      const html = createVenueMarkerHtml(undefined);
      expect(html).toContain(SERVICE_COLORS.DEFAULT.bg);
      expect(html).toContain(SERVICE_EMOJIS.DEFAULT);
    });

    it("handles null services gracefully", () => {
      const html = createVenueMarkerHtml(null);
      expect(html).toContain(SERVICE_COLORS.DEFAULT.bg);
    });
  });

  // ─── getVenueBadgeStyle ─────────────────────────────────────────────

  describe("getVenueBadgeStyle", () => {
    it("returns correct style object for known services", () => {
      const style = getVenueBadgeStyle(["CROSSFIT"]);
      expect(style).toEqual({
        backgroundColor: SERVICE_COLORS.CROSSFIT.bg,
        color: SERVICE_COLORS.CROSSFIT.text,
        borderColor: SERVICE_COLORS.CROSSFIT.border,
      });
    });

    it("returns DEFAULT style when no services", () => {
      const style = getVenueBadgeStyle(undefined);
      expect(style).toEqual({
        backgroundColor: SERVICE_COLORS.DEFAULT.bg,
        color: SERVICE_COLORS.DEFAULT.text,
        borderColor: SERVICE_COLORS.DEFAULT.border,
      });
    });

    it("returns DEFAULT style for null services", () => {
      const style = getVenueBadgeStyle(null);
      expect(style).toEqual({
        backgroundColor: SERVICE_COLORS.DEFAULT.bg,
        color: SERVICE_COLORS.DEFAULT.text,
        borderColor: SERVICE_COLORS.DEFAULT.border,
      });
    });
  });

  // ─── getServiceIcon ─────────────────────────────────────────────────

  describe("getServiceIcon", () => {
    it("returns correct emoji for known service", () => {
      expect(getServiceIcon("MMA")).toBe("🥊");
      expect(getServiceIcon("YOGA")).toBe("🧘");
      expect(getServiceIcon("COLD_PLUNGE")).toBe("🧊");
    });

    it("returns DEFAULT emoji for unknown service", () => {
      expect(getServiceIcon("NONEXISTENT")).toBe(SERVICE_EMOJIS.DEFAULT);
    });
  });

  // ─── SERVICE_COLORS ─────────────────────────────────────────────────

  describe("SERVICE_COLORS", () => {
    it("all entries have bg, border, and text properties", () => {
      for (const [, value] of Object.entries(SERVICE_COLORS)) {
        expect(value).toHaveProperty("bg");
        expect(value).toHaveProperty("border");
        expect(value).toHaveProperty("text");
        expect(typeof value.bg).toBe("string");
        expect(typeof value.border).toBe("string");
        expect(typeof value.text).toBe("string");
      }
    });
  });

  // ─── SERVICE_EMOJIS ─────────────────────────────────────────────────

  describe("SERVICE_EMOJIS", () => {
    it("all entries are non-empty strings", () => {
      for (const [, value] of Object.entries(SERVICE_EMOJIS)) {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });
});
