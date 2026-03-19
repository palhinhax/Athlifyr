import React from "react";
import { render, screen } from "@testing-library/react-native";
import { EventsSection } from "@/src/components/profile/EventsSection";

// react-i18next is already mocked in jest.setup.ts

const makeParticipation = (
  id: string,
  title: string,
  startDate: string,
  city: string | null = "Lisbon",
  variant: string | null = null
) => ({
  id,
  status: "going",
  event: {
    id: `event-${id}`,
    title,
    slug: title.toLowerCase().replace(/\s/g, "-"),
    startDate,
    city,
    country: "Portugal",
    sportTypes: ["TRAIL"],
  },
  variant: variant ? { name: variant, distanceKm: 32 } : null,
});

describe("EventsSection", () => {
  it("renders upcoming events section header", () => {
    render(<EventsSection upcomingEvents={[]} pastEvents={[]} />);

    expect(
      screen.getByText("profile.upcomingEventsCount")
    ).toBeTruthy();
  });

  it("renders past events section header", () => {
    render(<EventsSection upcomingEvents={[]} pastEvents={[]} />);

    expect(screen.getByText("profile.pastEventsCount")).toBeTruthy();
  });

  it("shows empty state when no upcoming events", () => {
    render(<EventsSection upcomingEvents={[]} pastEvents={[]} />);

    expect(screen.getByText("profile.noUpcomingEvents")).toBeTruthy();
    expect(
      screen.getByText("profile.noUpcomingEventsDescription")
    ).toBeTruthy();
  });

  it("shows empty state when no past events", () => {
    render(<EventsSection upcomingEvents={[]} pastEvents={[]} />);

    expect(screen.getByText("profile.noPastEvents")).toBeTruthy();
    expect(
      screen.getByText("profile.noPastEventsDescription")
    ).toBeTruthy();
  });

  it("renders upcoming event cards", () => {
    const upcoming = [
      makeParticipation("1", "Trail Manuelino", "2027-02-01"),
      makeParticipation("2", "Corrida de Coimbra", "2027-03-15"),
    ];

    render(<EventsSection upcomingEvents={upcoming} pastEvents={[]} />);

    expect(screen.getByText("Trail Manuelino")).toBeTruthy();
    expect(screen.getByText("Corrida de Coimbra")).toBeTruthy();
  });

  it("renders past event cards", () => {
    const past = [makeParticipation("3", "Marathon Lisboa", "2024-11-01")];

    render(<EventsSection upcomingEvents={[]} pastEvents={past} />);

    expect(screen.getByText("Marathon Lisboa")).toBeTruthy();
  });

  it("renders both upcoming and past events", () => {
    const upcoming = [makeParticipation("1", "Future Event", "2027-06-01")];
    const past = [makeParticipation("2", "Old Event", "2024-01-01")];

    render(<EventsSection upcomingEvents={upcoming} pastEvents={past} />);

    expect(screen.getByText("Future Event")).toBeTruthy();
    expect(screen.getByText("Old Event")).toBeTruthy();
  });

  it("renders event variant when provided", () => {
    const upcoming = [
      makeParticipation("1", "Trail Event", "2027-02-01", "Pombal", "Trail 32km"),
    ];

    render(<EventsSection upcomingEvents={upcoming} pastEvents={[]} />);

    expect(screen.getByText("Trail 32km")).toBeTruthy();
  });
});
