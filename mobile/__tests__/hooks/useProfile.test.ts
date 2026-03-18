import type { ProfileParticipation } from "@/src/hooks/useProfile";

// These filter functions replicate the logic in useProfile to test the
// business rules in isolation, without needing to mock react-query.
// If useProfile's filtering logic changes, these tests should be updated.

function filterUpcomingEvents(
  participations: ProfileParticipation[],
  now: Date
): ProfileParticipation[] {
  return participations.filter(
    (p) => new Date(p.event.startDate) > now && p.status === "going"
  );
}

function filterPastEvents(
  participations: ProfileParticipation[],
  now: Date
): ProfileParticipation[] {
  return participations.filter(
    (p) => new Date(p.event.startDate) <= now && p.status === "going"
  );
}

const makeParticipation = (
  id: string,
  startDate: string,
  status: "going" | "cancelled" | "interested" = "going"
): ProfileParticipation => ({
  id,
  status,
  event: {
    id: `event-${id}`,
    title: `Event ${id}`,
    slug: `event-${id}`,
    startDate,
    city: "Lisbon",
    country: "Portugal",
    sportTypes: ["RUNNING"],
  },
  variant: null,
});

describe("useProfile filtering logic", () => {
  const referenceDate = new Date("2026-06-01T00:00:00.000Z");

  describe("filterUpcomingEvents", () => {
    it("returns events after the reference date with going status", () => {
      const participations = [
        makeParticipation("1", "2026-07-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2026-08-15T00:00:00.000Z", "going"),
      ];

      const result = filterUpcomingEvents(participations, referenceDate);
      expect(result).toHaveLength(2);
    });

    it("excludes past events", () => {
      const participations = [
        makeParticipation("1", "2025-01-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2026-07-01T00:00:00.000Z", "going"),
      ];

      const result = filterUpcomingEvents(participations, referenceDate);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("excludes events with non-going status", () => {
      const participations = [
        makeParticipation("1", "2026-07-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2026-08-01T00:00:00.000Z", "cancelled"),
        makeParticipation("3", "2026-09-01T00:00:00.000Z", "interested"),
      ];

      const result = filterUpcomingEvents(participations, referenceDate);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("returns empty array when no upcoming events", () => {
      const participations = [
        makeParticipation("1", "2025-01-01T00:00:00.000Z", "going"),
      ];

      const result = filterUpcomingEvents(participations, referenceDate);
      expect(result).toHaveLength(0);
    });

    it("returns empty array for empty participations", () => {
      const result = filterUpcomingEvents([], referenceDate);
      expect(result).toHaveLength(0);
    });
  });

  describe("filterPastEvents", () => {
    it("returns events on or before the reference date with going status", () => {
      const participations = [
        makeParticipation("1", "2026-01-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2025-06-15T00:00:00.000Z", "going"),
      ];

      const result = filterPastEvents(participations, referenceDate);
      expect(result).toHaveLength(2);
    });

    it("includes events on the exact reference date", () => {
      const participations = [
        makeParticipation("1", "2026-06-01T00:00:00.000Z", "going"),
      ];

      const result = filterPastEvents(participations, referenceDate);
      expect(result).toHaveLength(1);
    });

    it("excludes future events", () => {
      const participations = [
        makeParticipation("1", "2026-05-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2026-12-01T00:00:00.000Z", "going"),
      ];

      const result = filterPastEvents(participations, referenceDate);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("excludes non-going participations", () => {
      const participations = [
        makeParticipation("1", "2025-06-01T00:00:00.000Z", "going"),
        makeParticipation("2", "2025-07-01T00:00:00.000Z", "cancelled"),
      ];

      const result = filterPastEvents(participations, referenceDate);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("upcoming vs past boundary", () => {
    it("correctly separates upcoming and past events", () => {
      const participations = [
        makeParticipation("past-1", "2025-01-01T00:00:00.000Z", "going"),
        makeParticipation("past-2", "2026-05-31T00:00:00.000Z", "going"),
        makeParticipation("future-1", "2026-07-01T00:00:00.000Z", "going"),
        makeParticipation("future-2", "2027-01-01T00:00:00.000Z", "going"),
        makeParticipation(
          "cancelled",
          "2026-08-01T00:00:00.000Z",
          "cancelled"
        ),
      ];

      const upcoming = filterUpcomingEvents(participations, referenceDate);
      const past = filterPastEvents(participations, referenceDate);

      expect(upcoming).toHaveLength(2);
      expect(past).toHaveLength(2);

      // Verify no overlap
      const upcomingIds = upcoming.map((p) => p.id);
      const pastIds = past.map((p) => p.id);
      expect(upcomingIds).toEqual(["future-1", "future-2"]);
      expect(pastIds).toEqual(["past-1", "past-2"]);
    });
  });
});
