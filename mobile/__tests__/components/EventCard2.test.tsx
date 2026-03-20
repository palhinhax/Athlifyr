import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EventCard } from "@/src/components/EventCard";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("lucide-react-native", () => ({
  Calendar: () => "Calendar",
  MapPin: () => "MapPin",
  Route: () => "Route",
  CheckCircle: () => "CheckCircle",
  MessageCircle: () => "MessageCircle",
  Gift: () => "Gift",
  Star: () => "Star",
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedImage: ({ alt }: { alt?: string }) => alt || "CachedImage",
}));

jest.mock("@/src/components/SportBadge", () => ({
  SportBadge: ({ sportType }: { sportType?: string }) => sportType,
}));

jest.mock("@/src/lib/event-utils", () => ({
  formatDateRange: () => "15 Jun - 16 Jun 2025",
}));

describe("EventCard", () => {
  const event = {
    slug: "marathon-lisbon-2025",
    title: "Marathon Lisbon",
    imageUrl: "https://example.com/image.jpg",
    startDate: "2025-06-15",
    endDate: "2025-06-16",
    city: "Lisbon",
    country: "Portugal",
    sportTypes: ["RUNNING"],
    isFeatured: true,
    variants: [
      { id: "v1", distanceKm: 42, name: "Full" },
      { id: "v2", distanceKm: 21, name: "Half" },
    ],
    _count: { comments: 5, giveaways: 1 },
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders event title", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("Marathon Lisbon")).toBeTruthy();
  });

  it("renders date range", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("15 Jun - 16 Jun 2025")).toBeTruthy();
  });

  it("renders city and country", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("Lisbon, Portugal")).toBeTruthy();
  });

  it("renders variant distances", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("42 km")).toBeTruthy();
    expect(getByText("21 km")).toBeTruthy();
  });

  it("renders comments count", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("5")).toBeTruthy();
  });

  it("renders giveaway badge", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("events.giveaway.badge")).toBeTruthy();
  });

  it("renders featured badge", () => {
    const { getByText } = render(<EventCard event={event} />);
    expect(getByText("events.featured")).toBeTruthy();
  });

  it("renders participating badge when isParticipating", () => {
    const { getByText } = render(
      <EventCard event={event} isParticipating={true} />
    );
    expect(getByText("Vou")).toBeTruthy();
  });

  it("navigates on press", () => {
    const { getByText } = render(<EventCard event={event} />);
    fireEvent.press(getByText("Marathon Lisbon"));
    expect(mockPush).toHaveBeenCalledWith("/events/marathon-lisbon-2025");
  });

  it("renders placeholder when no image", () => {
    const e = { ...event, imageUrl: null };
    const { toJSON } = render(<EventCard event={e} />);
    expect(toJSON()).toBeTruthy();
  });
});
