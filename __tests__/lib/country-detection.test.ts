import {
  getCountryFromTimezone,
  getDefaultMapCenter,
  getDefaultCountry,
  getUserCountryFromLocale,
} from "@/lib/country-detection";

describe("country-detection", () => {
  describe("getCountryFromTimezone", () => {
    it("should return null in server context (no window)", () => {
      // In Node.js test environment, window is undefined
      expect(getCountryFromTimezone()).toBeNull();
    });
  });

  describe("getUserCountryFromLocale", () => {
    it("should map pt locale to Portugal", () => {
      expect(getUserCountryFromLocale("pt")).toBe("Portugal");
    });

    it("should map es locale to Spain", () => {
      expect(getUserCountryFromLocale("es")).toBe("Spain");
    });

    it("should map fr locale to France", () => {
      expect(getUserCountryFromLocale("fr")).toBe("France");
    });

    it("should map de locale to Germany", () => {
      expect(getUserCountryFromLocale("de")).toBe("Germany");
    });

    it("should map it locale to Italy", () => {
      expect(getUserCountryFromLocale("it")).toBe("Italy");
    });

    it("should return null for en locale", () => {
      expect(getUserCountryFromLocale("en")).toBeNull();
    });

    it("should return null for unknown locale", () => {
      expect(getUserCountryFromLocale("unknown")).toBeNull();
    });
  });

  describe("getDefaultMapCenter", () => {
    it("should return Portugal coordinates as default when no locale", () => {
      const center = getDefaultMapCenter();
      expect(center).toEqual([39.5, -8.0]);
    });

    it("should return country center based on locale", () => {
      const center = getDefaultMapCenter("es");
      expect(center).toEqual([40.4, -3.7]); // Spain coordinates
    });

    it("should return Portugal coordinates for en locale (no country mapping)", () => {
      const center = getDefaultMapCenter("en");
      expect(center).toEqual([39.5, -8.0]);
    });

    it("should return France coordinates for fr locale", () => {
      const center = getDefaultMapCenter("fr");
      expect(center).toEqual([46.6, 2.3]);
    });

    it("should return Germany coordinates for de locale", () => {
      const center = getDefaultMapCenter("de");
      expect(center).toEqual([51.2, 10.4]);
    });

    it("should return Italy coordinates for it locale", () => {
      const center = getDefaultMapCenter("it");
      expect(center).toEqual([42.8, 12.6]);
    });
  });

  describe("getDefaultCountry", () => {
    it("should return Portugal as default when no locale", () => {
      expect(getDefaultCountry()).toBe("Portugal");
    });

    it("should return country based on locale", () => {
      expect(getDefaultCountry("es")).toBe("Spain");
      expect(getDefaultCountry("fr")).toBe("France");
      expect(getDefaultCountry("de")).toBe("Germany");
      expect(getDefaultCountry("it")).toBe("Italy");
    });

    it("should return Portugal for en locale (no country mapping)", () => {
      expect(getDefaultCountry("en")).toBe("Portugal");
    });
  });
});
