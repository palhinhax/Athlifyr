import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VenueCard } from "@/src/components/VenueCard";

const mockPush = jest.fn();
const mockPrefetchQuery = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ prefetchQuery: mockPrefetchQuery }),
}));

jest.mock("lucide-react-native", () => ({
  MapPin: () => "MapPin",
  Users: () => "Users",
  Building2: () => "Building2",
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedImage: ({ alt }: { alt?: string }) => alt || "CachedImage",
}));

jest.mock("date-fns", () => ({
  startOfMonth: (d: Date) => d,
  endOfMonth: (d: Date) => d,
  format: () => "2025-06",
}));

describe("VenueCard", () => {
  const venue = {
    id: "v1",
    slug: "gym-lisbon",
    name: "Gym Lisbon",
    type: "fitness_studio",
    city: "Lisbon",
    country: "Portugal",
    coverImage: "https://example.com/cover.jpg",
    logo: null,
    services: ["personal_training", "group_classes", "swimming", "yoga"],
    _count: { members: 42 },
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders venue name", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    expect(getByText("Gym Lisbon")).toBeTruthy();
  });

  it("renders venue type badge", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    expect(getByText("fitness studio")).toBeTruthy();
  });

  it("renders city and country", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    expect(getByText("Lisbon, Portugal")).toBeTruthy();
  });

  it("renders member count with plural", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    expect(getByText("42 members")).toBeTruthy();
  });

  it("renders singular member", () => {
    const v = { ...venue, _count: { members: 1 } };
    const { getByText } = render(<VenueCard venue={v} />);
    expect(getByText("1 member")).toBeTruthy();
  });

  it("limits service chips to 3 + overflow", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    expect(getByText("+1")).toBeTruthy();
  });

  it("navigates on press", () => {
    const { getByText } = render(<VenueCard venue={venue} />);
    fireEvent.press(getByText("Gym Lisbon"));
    expect(mockPush).toHaveBeenCalledWith("/venues/gym-lisbon");
  });

  it("renders placeholder when no cover image", () => {
    const v = { ...venue, coverImage: null };
    const { toJSON } = render(<VenueCard venue={v} />);
    expect(toJSON()).toBeTruthy();
  });
});
