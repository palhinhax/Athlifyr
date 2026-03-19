/**
 * @jest-environment node
 */

// Verify barrel exports work correctly
import * as athliAI from "@/lib/athli-ai";

jest.mock("@/lib/prisma", () => ({
  prisma: {},
}));

describe("athli-ai barrel exports", () => {
  it("exports system prompt functions", () => {
    expect(athliAI.getSystemPrompt).toBeDefined();
  });

  it("exports platform functions", () => {
    expect(athliAI.getPlatformInfo).toBeDefined();
  });

  it("exports event functions", () => {
    expect(athliAI.searchEvents).toBeDefined();
    expect(athliAI.getEventDetails).toBeDefined();
    expect(athliAI.getUserEvents).toBeDefined();
  });

  it("exports venue functions", () => {
    expect(athliAI.searchVenues).toBeDefined();
    expect(athliAI.getVenueDetails).toBeDefined();
  });

  it("exports session functions", () => {
    expect(athliAI.getAvailableSessions).toBeDefined();
    expect(athliAI.bookSession).toBeDefined();
    expect(athliAI.getSessionDetails).toBeDefined();
  });

  it("exports analyses functions", () => {
    expect(athliAI.getUserAnalyses).toBeDefined();
  });

  it("exports workout history functions", () => {
    expect(athliAI.getUserWorkoutHistory).toBeDefined();
    expect(athliAI.formatDuration).toBeDefined();
    expect(athliAI.formatMetricParts).toBeDefined();
    expect(athliAI.formatExerciseDetail).toBeDefined();
  });

  it("exports training plan functions", () => {
    expect(athliAI.saveTrainingPlan).toBeDefined();
    expect(athliAI.listAvailableExercises).toBeDefined();
  });

  it("exports booking functions", () => {
    expect(athliAI.getUserBookings).toBeDefined();
  });

  it("exports PR functions", () => {
    expect(athliAI.getUserPRs).toBeDefined();
  });

  it("exports performance log functions", () => {
    expect(athliAI.logPerformanceEntry).toBeDefined();
  });

  it("exports giveaway functions", () => {
    expect(athliAI.searchGiveaways).toBeDefined();
  });

  it("exports admin note functions", () => {
    expect(athliAI.submitAdminNote).toBeDefined();
  });

  it("exports tool definitions", () => {
    expect(athliAI.athliTools).toBeDefined();
  });
});
