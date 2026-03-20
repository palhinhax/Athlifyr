/**
 * @jest-environment node
 */

import { getSystemPrompt } from "@/lib/athli-ai/system-prompt";
import type { AthliPageContext } from "@/lib/athli-ai/system-prompt";

describe("getSystemPrompt", () => {
  it("generates prompt in English", () => {
    const result = getSystemPrompt("en", "John");

    expect(result).toContain("English");
    expect(result).toContain("John");
    expect(result).not.toContain("European Portuguese");
  });

  it("includes Portuguese-specific rules for pt locale", () => {
    const result = getSystemPrompt("pt", "Maria");

    expect(result).toContain("European Portuguese (pt-PT)");
    expect(result).toContain("tu");
    expect(result).toContain("você");
  });

  it("works without user name", () => {
    const result = getSystemPrompt("en", null);

    expect(result).toContain("Athli");
    expect(result).not.toContain("The user's name is");
  });

  it("generates prompt for all supported locales", () => {
    const locales = ["pt", "en", "es", "fr", "de", "it"];

    for (const loc of locales) {
      const result = getSystemPrompt(loc, null);
      expect(result).toContain("Athli");
      expect(result.length).toBeGreaterThan(100);
    }
  });

  it("defaults to English for unknown locale", () => {
    const result = getSystemPrompt("xx", null);

    expect(result).toContain("English");
  });

  it("includes current date info", () => {
    const result = getSystemPrompt("en", null);

    expect(result).toContain("Today is");
    // Check it contains a day of the week
    expect(result).toMatch(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/
    );
  });

  it("includes event page context", () => {
    const context: AthliPageContext = { type: "event", slug: "trail-x-2026" };
    const result = getSystemPrompt("en", null, context);

    expect(result).toContain("EVENT page");
    expect(result).toContain("trail-x-2026");
  });

  it("includes venue page context", () => {
    const context: AthliPageContext = { type: "venue", slug: "box-alpha" };
    const result = getSystemPrompt("en", null, context);

    expect(result).toContain("VENUE page");
    expect(result).toContain("box-alpha");
  });

  it("omits page context section when not provided", () => {
    const result = getSystemPrompt("en", null);

    expect(result).not.toContain("Current Page Context");
  });

  it("includes weekend date references", () => {
    const result = getSystemPrompt("en", null);

    expect(result).toContain("Next weekend");
    expect(result).toContain("Saturday");
    expect(result).toContain("Sunday");
  });

  it("includes all tool descriptions", () => {
    const result = getSystemPrompt("en", null);

    expect(result).toContain("Search Events");
    expect(result).toContain("Search Venues");
    expect(result).toContain("Book Session");
    expect(result).toContain("Save Training Plans");
    expect(result).toContain("Get My PRs");
    expect(result).toContain("Submit Admin Note");
  });
});
