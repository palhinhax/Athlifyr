import { formatPrice, getCurrencySymbol } from "@/lib/currency";

// ============================================================================
// formatPrice
// ============================================================================

describe("formatPrice", () => {
  it("formats EUR with symbol after number (de-DE locale)", () => {
    const result = formatPrice(99.99, "EUR");
    // de-DE formats with comma: "99,99€"
    expect(result).toContain("€");
    expect(result).toContain("99");
  });

  it("defaults to EUR when no currency provided", () => {
    const result = formatPrice(50);
    expect(result).toContain("€");
  });

  it("formats GBP with £ symbol before number", () => {
    const result = formatPrice(49.99, "GBP");
    expect(result).toMatch(/^£/);
    expect(result).toContain("49.99");
  });

  it("formats USD with $ symbol before number", () => {
    const result = formatPrice(100, "USD");
    expect(result).toMatch(/^\$/);
    expect(result).toContain("100.00");
  });

  it("formats CHF with CHF before number", () => {
    const result = formatPrice(75.5, "CHF");
    expect(result).toMatch(/^CHF/);
  });

  it("always shows 2 decimal places", () => {
    const result = formatPrice(100, "USD");
    expect(result).toContain("100.00");
  });

  it("formats large numbers correctly", () => {
    const result = formatPrice(1234.56, "USD");
    expect(result).toContain("1,234.56");
  });

  it("formats zero correctly", () => {
    const result = formatPrice(0, "EUR");
    expect(result).toContain("0");
    expect(result).toContain("€");
  });
});

// ============================================================================
// getCurrencySymbol
// ============================================================================

describe("getCurrencySymbol", () => {
  it("returns € for EUR", () => {
    expect(getCurrencySymbol("EUR")).toBe("€");
  });

  it("returns £ for GBP", () => {
    expect(getCurrencySymbol("GBP")).toBe("£");
  });

  it("returns $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("returns CHF for CHF", () => {
    expect(getCurrencySymbol("CHF")).toBe("CHF");
  });

  it("defaults to EUR when no argument", () => {
    expect(getCurrencySymbol()).toBe("€");
  });
});
