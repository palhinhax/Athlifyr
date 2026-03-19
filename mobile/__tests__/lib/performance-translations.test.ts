import fs from "fs";
import path from "path";

// ── Validate Translation Keys ────────────────────────────────────────────────
// This test validates that required translation keys exist across all locales,
// catching mismatches between code expectations and locale file keys.

const LOCALES = ["en", "pt", "es", "fr", "de", "it"];
const LOCALES_DIR = path.join(__dirname, "../../src/locales");

function loadLocale(lang: string): Record<string, unknown> {
  const filePath = path.join(LOCALES_DIR, lang, "common.json");
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as Record<string, unknown>;
}

function getNestedKey(
  obj: Record<string, unknown>,
  keyPath: string
): unknown {
  return keyPath.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

describe("Translation completeness", () => {
  const locales: Record<string, Record<string, unknown>> = {};

  beforeAll(() => {
    for (const lang of LOCALES) {
      locales[lang] = loadLocale(lang);
    }
  });

  describe("performance tab labels", () => {
    const tabLabelKeys = [
      "sports.RUNNING",
      "sports.TRAIL",
      "profile.strength",
      "sports.HYROX",
    ];

    it.each(tabLabelKeys)(
      "has '%s' in all locales",
      (key) => {
        for (const lang of LOCALES) {
          const value = getNestedKey(locales[lang], key);
          expect(value).toBeDefined();
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      }
    );
  });

  describe("performance empty state messages", () => {
    const emptyStateKeys = [
      "performance.run.noData",
      "performance.run.noDataDesc",
      "performance.trail.noData",
      "performance.trail.noDataDesc",
      "performance.strength.noData",
      "performance.strength.noDataDesc",
      "performance.hyrox.noData",
      "performance.hyrox.noDataDesc",
    ];

    it.each(emptyStateKeys)(
      "has '%s' in all locales",
      (key) => {
        for (const lang of LOCALES) {
          const value = getNestedKey(locales[lang], key);
          expect(value).toBeDefined();
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      }
    );
  });

  describe("performance general keys", () => {
    const generalKeys = [
      "profile.performance",
      "performance.add",
      "performance.loading",
    ];

    it.each(generalKeys)(
      "has '%s' in all locales",
      (key) => {
        for (const lang of LOCALES) {
          const value = getNestedKey(locales[lang], key);
          expect(value).toBeDefined();
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      }
    );
  });

  describe("performance hyrox form keys", () => {
    const hyroxFormKeys = [
      "performance.hyrox.addTitle",
      "performance.hyrox.category",
      "performance.hyrox.time",
      "performance.hyrox.savedSuccess",
      "performance.hyrox.saveFailed",
      "performance.hyrox.personalBest",
      "performance.hyrox.totalRaces",
    ];

    it.each(hyroxFormKeys)(
      "has '%s' in all locales",
      (key) => {
        for (const lang of LOCALES) {
          const value = getNestedKey(locales[lang], key);
          expect(value).toBeDefined();
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      }
    );
  });
});
