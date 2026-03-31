import React from "react";
import { render } from "@testing-library/react-native";
import { EventMetaInfo } from "@/src/components/EventMetaInfo";

jest.mock("lucide-react-native", () => ({
  Calendar: () => "CalendarIcon",
  MapPin: () => "MapPinIcon",
  Users: () => "UsersIcon",
}));

jest.mock("@/src/lib/event-utils", () => ({
  formatDateRange: jest.fn(() => "Jun 1 - Jun 3, 2025"),
}));

describe("EventMetaInfo", () => {
  it("renders date info", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate="2025-06-03"
        city="Lisbon"
        country="Portugal"
      />
    );
    expect(getByText("Date")).toBeTruthy();
    expect(getByText("Jun 1 - Jun 3, 2025")).toBeTruthy();
  });

  it("renders location info", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
      />
    );
    expect(getByText("Location")).toBeTruthy();
    expect(getByText("Lisbon, Portugal")).toBeTruthy();
  });

  it("renders following going when count > 0", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        followingGoingCount={3}
      />
    );
    expect(getByText("Following Going")).toBeTruthy();
    expect(getByText("3 people")).toBeTruthy();
  });

  it("shows singular person for count 1", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        followingGoingCount={1}
      />
    );
    expect(getByText("1 person")).toBeTruthy();
  });

  it("does not show following section when count is 0", () => {
    const { queryByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        followingGoingCount={0}
      />
    );
    expect(queryByText("Following Going")).toBeNull();
  });
});
