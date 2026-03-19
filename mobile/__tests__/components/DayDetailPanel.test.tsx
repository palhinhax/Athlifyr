import React from "react";
import { render } from "@testing-library/react-native";
import { DayDetailPanel } from "@/src/components/schedule/DayDetailPanel";

jest.mock("lucide-react-native", () => ({
  CalendarClock: () => "CalendarClock",
  MapPin: () => "MapPin",
  Clock: () => "Clock",
  Users: () => "Users",
}));

describe("DayDetailPanel", () => {
  const selectedDay = new Date(2025, 5, 15);

  it("renders empty state when no sessions or events", () => {
    const { getByText } = render(
      <DayDetailPanel selectedDay={selectedDay} sessions={[]} events={[]} />
    );
    expect(getByText("schedule.noActivitiesThisDay")).toBeTruthy();
  });

  it("renders event cards", () => {
    const events = [
      {
        id: "e1",
        title: "Marathon Lisbon",
        startsAt: "2025-06-15T08:00:00Z",
        city: "Lisbon",
        country: "Portugal",
        variantName: "Full",
        variantDistance: 42,
      },
    ];
    const { getByText } = render(
      <DayDetailPanel selectedDay={selectedDay} sessions={[]} events={events} />
    );
    expect(getByText("Marathon Lisbon")).toBeTruthy();
    expect(getByText("Full • 42km")).toBeTruthy();
    expect(getByText("Lisbon, Portugal")).toBeTruthy();
  });

  it("renders event badge", () => {
    const events = [
      {
        id: "e1",
        title: "Race",
        startsAt: "2025-06-15T08:00:00Z",
        city: "Porto",
        country: "Portugal",
        variantName: null,
        variantDistance: null,
      },
    ];
    const { getByText } = render(
      <DayDetailPanel selectedDay={selectedDay} sessions={[]} events={events} />
    );
    expect(getByText("common.event")).toBeTruthy();
  });

  it("renders session cards", () => {
    const sessions = [
      {
        id: "s1",
        title: "CrossFit Class",
        startsAt: "2025-06-15T10:00:00Z",
        endsAt: "2025-06-15T11:00:00Z",
        venue: { name: "Box Lisbon" },
        userRole: "COACH",
        _count: { bookings: 8 },
        capacity: 12,
      },
    ];
    const { getByText } = render(
      <DayDetailPanel
        selectedDay={selectedDay}
        sessions={sessions}
        events={[]}
      />
    );
    expect(getByText("CrossFit Class")).toBeTruthy();
    expect(getByText("Box Lisbon")).toBeTruthy();
    expect(getByText("schedule.asCoach")).toBeTruthy();
    expect(getByText("8/12")).toBeTruthy();
  });

  it("renders participant role for non-coach sessions", () => {
    const sessions = [
      {
        id: "s1",
        title: "Yoga",
        startsAt: "2025-06-15T10:00:00Z",
        endsAt: "2025-06-15T11:00:00Z",
        venue: { name: "Studio" },
        userRole: "CLIENT",
        _count: { bookings: 5 },
        capacity: null,
      },
    ];
    const { getByText } = render(
      <DayDetailPanel
        selectedDay={selectedDay}
        sessions={sessions}
        events={[]}
      />
    );
    expect(getByText("schedule.asParticipant")).toBeTruthy();
  });
});
