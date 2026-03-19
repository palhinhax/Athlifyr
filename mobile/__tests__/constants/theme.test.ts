import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  theme,
  primaryPalette,
  secondaryPalette,
} from "@/src/constants/theme";

describe("primaryPalette", () => {
  it("has 10 shades (50-900)", () => {
    expect(Object.keys(primaryPalette)).toHaveLength(10);
  });

  it("contains hex color values", () => {
    Object.values(primaryPalette).forEach((val) => {
      expect(val).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe("secondaryPalette", () => {
  it("has 10 shades (50-900)", () => {
    expect(Object.keys(secondaryPalette)).toHaveLength(10);
  });
});

describe("colors", () => {
  it("has primary color", () => {
    expect(colors.primary).toBe("#e57b2a");
  });

  it("has semantic colors", () => {
    expect(colors.success).toBeDefined();
    expect(colors.warning).toBeDefined();
    expect(colors.error).toBeDefined();
    expect(colors.info).toBeDefined();
  });

  it("has UI colors", () => {
    expect(colors.background).toBe("#ffffff");
    expect(colors.foreground).toBe("#131820");
    expect(colors.border).toBeDefined();
  });
});

describe("typography", () => {
  it("has font sizes from xs to 4xl", () => {
    expect(typography.fontSize.xs).toBe(12);
    expect(typography.fontSize.base).toBe(16);
    expect(typography.fontSize["4xl"]).toBe(36);
  });

  it("has font weights", () => {
    expect(typography.fontWeight.normal).toBe("400");
    expect(typography.fontWeight.bold).toBe("700");
  });

  it("has line heights", () => {
    expect(typography.lineHeight.tight).toBeLessThan(
      typography.lineHeight.relaxed
    );
  });
});

describe("spacing", () => {
  it("has incremental values", () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
    expect(spacing.lg).toBeLessThan(spacing.xl);
  });
});

describe("borderRadius", () => {
  it("has none as 0", () => {
    expect(borderRadius.none).toBe(0);
  });

  it("has full as 9999", () => {
    expect(borderRadius.full).toBe(9999);
  });
});

describe("shadows", () => {
  it("has sm, md, lg, xl variants", () => {
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
    expect(shadows.xl).toBeDefined();
  });

  it("has increasing elevation", () => {
    expect(shadows.sm.elevation).toBeLessThan(shadows.md.elevation);
    expect(shadows.md.elevation).toBeLessThan(shadows.lg.elevation);
    expect(shadows.lg.elevation).toBeLessThan(shadows.xl.elevation);
  });
});

describe("layout", () => {
  it("has container and screen padding", () => {
    expect(layout.containerPadding).toBe(spacing.md);
    expect(layout.screenPadding).toBe(spacing.lg);
  });
});

describe("theme", () => {
  it("aggregates all design tokens", () => {
    expect(theme.colors).toBe(colors);
    expect(theme.typography).toBe(typography);
    expect(theme.spacing).toBe(spacing);
    expect(theme.borderRadius).toBe(borderRadius);
    expect(theme.shadows).toBe(shadows);
    expect(theme.layout).toBe(layout);
  });
});
