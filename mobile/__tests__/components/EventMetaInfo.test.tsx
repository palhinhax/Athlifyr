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

  it("renders friends going when count > 0", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        friendsGoingCount={3}
      />
    );
    expect(getByText("Friends Going")).toBeTruthy();
    expect(getByText("3 friends")).toBeTruthy();
  });

  it("shows singular friend for count 1", () => {
    const { getByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        friendsGoingCount={1}
      />
    );
    expect(getByText("1 friend")).toBeTruthy();
  });

  it("does not show friends section when count is 0", () => {
    const { queryByText } = render(
      <EventMetaInfo
        startDate="2025-06-01"
        endDate={null}
        city="Lisbon"
        country="Portugal"
        friendsGoingCount={0}
      />
    );
    expect(queryByText("Friends Going")).toBeNull();
  });
});
