import React from "react";
import { render } from "@testing-library/react-native";
import { EventVariantsList } from "@/src/components/EventVariantsList";

jest.mock("lucide-react-native", () => ({
  Route: () => "RouteIcon",
  Clock: () => "ClockIcon",
}));

jest.mock("@/src/lib/event-utils", () => ({
  formatDate: jest.fn(() => "Jun 1, 2025"),
}));

describe("EventVariantsList", () => {
  it("renders nothing for empty variants", () => {
    const { toJSON } = render(<EventVariantsList variants={[]} />);
    expect(toJSON()).toBeNull();
  });

  it("renders header with Distances title", () => {
    const variants = [{ id: "1", eventId: "e1", name: "5K", distanceKm: 5 }];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("Distances")).toBeTruthy();
  });

  it("renders variant with distance", () => {
    const variants = [{ id: "1", eventId: "e1", name: "10K", distanceKm: 10 }];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("10 km")).toBeTruthy();
  });

  it("renders variant name when no distance", () => {
    const variants = [
      { id: "1", eventId: "e1", name: "Fun Run", distanceKm: null },
    ];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("Fun Run")).toBeTruthy();
  });

  it("renders multiple variants", () => {
    const variants = [
      { id: "1", eventId: "e1", name: "5K", distanceKm: 5 },
      { id: "2", eventId: "e1", name: "10K", distanceKm: 10 },
      { id: "3", eventId: "e1", name: "Half Marathon", distanceKm: 21 },
    ];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("5 km")).toBeTruthy();
    expect(getByText("10 km")).toBeTruthy();
    expect(getByText("21 km")).toBeTruthy();
  });

  it("renders triathlon segments when present", () => {
    const variants = [
      {
        id: "1",
        eventId: "e1",
        name: "Sprint",
        distanceKm: null,
        triathlonSegments: [
          {
            id: "s1",
            variantId: "1",
            segmentType: "Swim",
            distanceKm: 0.75,
            terrainType: "pool",
            order: 1,
          },
          {
            id: "s2",
            variantId: "1",
            segmentType: "Bike",
            distanceKm: 20,
            terrainType: "road",
            order: 2,
          },
          {
            id: "s3",
            variantId: "1",
            segmentType: "Run",
            distanceKm: 5,
            terrainType: "road",
            order: 3,
          },
        ],
      },
    ];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("Swim: 0.75 km")).toBeTruthy();
    expect(getByText("Bike: 20 km")).toBeTruthy();
    expect(getByText("Run: 5 km")).toBeTruthy();
  });

  it("renders start date and time when provided", () => {
    const variants = [
      {
        id: "1",
        eventId: "e1",
        name: "5K",
        distanceKm: 5,
        startDate: "2025-06-01",
        startTime: "08:00",
      },
    ];
    const { getByText } = render(<EventVariantsList variants={variants} />);
    expect(getByText("Jun 1, 2025 • 08:00")).toBeTruthy();
  });
});
