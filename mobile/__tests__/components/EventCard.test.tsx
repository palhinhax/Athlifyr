import React from "react";
import { render, screen } from "@testing-library/react-native";
import { EventCard } from "@/src/components/profile/EventCard";

// lucide-react-native icons render as SVG; jest-expo handles the transform

describe("EventCard", () => {
  it("renders event title, date and location", () => {
    render(
      <EventCard
        title="Trail Manuelino 2026"
        date="1 Feb 2026"
        location="Abiul, Portugal"
      />
    );

    expect(screen.getByText("Trail Manuelino 2026")).toBeTruthy();
    expect(screen.getByText("1 Feb 2026")).toBeTruthy();
    expect(screen.getByText("Abiul, Portugal")).toBeTruthy();
  });

  it("renders variant badge when provided", () => {
    render(
      <EventCard
        title="Trail Event"
        date="2026-03-01"
        location="Coimbra"
        variant="Trail 32km"
      />
    );

    expect(screen.getByText("Trail 32km")).toBeTruthy();
  });

  it("does not render variant badge when not provided", () => {
    render(
      <EventCard title="Simple Event" date="2026-03-01" location="Porto" />
    );

    expect(screen.queryByText("Trail 32km")).toBeNull();
  });

  it("renders as past event", () => {
    render(
      <EventCard
        title="Past Marathon"
        date="2025-01-15"
        location="Lisbon"
        isPast
      />
    );

    expect(screen.getByText("Past Marathon")).toBeTruthy();
    expect(screen.getByText("2025-01-15")).toBeTruthy();
  });

  it("renders with all props provided", () => {
    render(
      <EventCard
        title="Full Event"
        date="2026-06-15"
        location="Madrid, Spain"
        variant="Sprint 18km"
        isPast={false}
      />
    );

    expect(screen.getByText("Full Event")).toBeTruthy();
    expect(screen.getByText("2026-06-15")).toBeTruthy();
    expect(screen.getByText("Madrid, Spain")).toBeTruthy();
    expect(screen.getByText("Sprint 18km")).toBeTruthy();
  });
});
