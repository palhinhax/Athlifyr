import { generateSportsEventSchema } from "@/lib/structured-data";
import { SportType } from "@prisma/client";

describe("structured-data", () => {
  describe("generateSportsEventSchema", () => {
    const baseEvent = {
      id: "test-id",
      title: "Test Event",
      slug: "test-event",
      description: "Test description",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-06-15T09:00:00Z"),
      endDate: new Date("2026-06-15T14:00:00Z"),
      city: "Lisboa",
      country: "Portugal",
      imageUrl: "https://example.com/image.jpg",
      externalUrl: "https://example.com",
      isFeatured: false,
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl: "https://maps.google.com",
      stravaRouteEmbed: null,
      registrationDeadline: new Date("2026-06-10T23:59:59Z"),
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    };

    const baseVariant = {
      id: "variant-1",
      eventId: "test-id",
      name: "10K",
      description: "10 kilometer race",
      distanceKm: 10,
      price: 25.0,
      maxParticipants: 100,
      startDate: new Date("2026-06-15T09:00:00Z"),
      startTime: "09:00",
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: null,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
      pricingPhases: [],
    };

    it("should include performer field", () => {
      const event = {
        ...baseEvent,
        variants: [baseVariant],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema.performer).toBeDefined();
      expect(schema.performer).toEqual({
        "@type": "Organization",
        name: "Athlifyr",
        url: expect.any(String),
      });
    });

    it("should include validFrom in offers when variant has pricing phases", () => {
      const pricingPhase = {
        id: "phase-1",
        eventId: "test-id",
        variantId: "variant-1",
        event: null,
        variant: null,
        name: "Early Bird",
        startDate: new Date("2026-03-01T00:00:00Z"),
        endDate: new Date("2026-04-30T23:59:59Z"),
        price: 20.0,
        discountPercent: null,
        note: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
      };

      const event = {
        ...baseEvent,
        variants: [
          {
            ...baseVariant,
            pricingPhases: [pricingPhase],
          },
        ],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema.offers).toBeDefined();
      if (schema.offers) {
        expect(schema.offers[0].validFrom).toBe("2026-03-01T00:00:00.000Z");
      }
    });

    it("should use event-level pricing phase if variant has none", () => {
      const eventPricingPhase = {
        id: "phase-1",
        eventId: "test-id",
        variantId: null,
        event: null,
        variant: null,
        name: "General Registration",
        startDate: new Date("2026-02-01T00:00:00Z"),
        endDate: new Date("2026-06-10T23:59:59Z"),
        price: 25.0,
        discountPercent: null,
        note: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
      };

      const event = {
        ...baseEvent,
        variants: [baseVariant],
        pricingPhases: [eventPricingPhase],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema.offers).toBeDefined();
      if (schema.offers) {
        expect(schema.offers[0].validFrom).toBe("2026-02-01T00:00:00.000Z");
      }
    });

    it("should use event createdAt as fallback for validFrom", () => {
      const event = {
        ...baseEvent,
        variants: [baseVariant],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema.offers).toBeDefined();
      if (schema.offers) {
        expect(schema.offers[0].validFrom).toBe("2026-01-01T00:00:00.000Z");
      }
    });

    it("should generate complete schema with all required fields", () => {
      const event = {
        ...baseEvent,
        variants: [baseVariant],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("SportsEvent");
      expect(schema.name).toBe("Test Event");
      expect(schema.description).toBe("Test description");
      expect(schema.startDate).toBe("2026-06-15T09:00:00.000Z");
      expect(schema.endDate).toBe("2026-06-15T14:00:00.000Z");
      expect(schema.location).toBeDefined();
      expect(schema.organizer).toBeDefined();
      expect(schema.performer).toBeDefined();
      expect(schema.offers).toBeDefined();
    });

    it("should handle events without variants", () => {
      const event = {
        ...baseEvent,
        variants: [],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      expect(schema.offers).toBeUndefined();
      expect(schema.performer).toBeDefined();
    });

    it("should include all offer fields required by Google", () => {
      const event = {
        ...baseEvent,
        variants: [baseVariant],
        pricingPhases: [],
      };

      const schema = generateSportsEventSchema(event);

      if (schema.offers) {
        expect(schema.offers[0]).toEqual({
          "@type": "Offer",
          name: "10K",
          price: "25",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: expect.any(String),
          validFrom: expect.any(String),
        });
      }
    });
  });
});
