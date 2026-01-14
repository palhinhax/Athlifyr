import { validateFieldLength, getAutoFontScale } from "@/lib/instagram-export";

describe("Instagram Export Utilities", () => {
  describe("validateFieldLength", () => {
    it("should validate field within max length", () => {
      const result = validateFieldLength("Hello", 10, "Title");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should invalidate field exceeding max length", () => {
      const result = validateFieldLength(
        "This is a very long text",
        10,
        "Title"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("Title must be 10 characters or less");
    });

    it("should validate field at exactly max length", () => {
      const result = validateFieldLength("1234567890", 10, "Title");
      expect(result.valid).toBe(true);
    });
  });

  describe("getAutoFontScale", () => {
    it("should return 1.0 for short text", () => {
      const scale = getAutoFontScale(10, 50);
      expect(scale).toBe(1.0);
    });

    it("should return 0.9 for medium text", () => {
      const scale = getAutoFontScale(38, 50);
      expect(scale).toBe(0.9);
    });

    it("should return 0.8 for long text", () => {
      const scale = getAutoFontScale(45, 50);
      expect(scale).toBe(0.8);
    });

    it("should return 0.7 for very long text", () => {
      const scale = getAutoFontScale(55, 50);
      expect(scale).toBe(0.7);
    });

    it("should handle edge case at 70% threshold", () => {
      const scale = getAutoFontScale(35, 50); // Exactly 70%
      expect(scale).toBe(1.0);
    });

    it("should handle edge case at 85% threshold", () => {
      const scale = getAutoFontScale(42, 50); // 84%
      expect(scale).toBe(0.9);
    });
  });
});
