import React from "react";
import { render } from "@testing-library/react-native";
import { CalendarButton } from "@/src/components/CalendarButton";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  CalendarClock: () => "CalendarClockIcon",
}));

describe("CalendarButton", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<CalendarButton />);
    expect(toJSON()).toBeTruthy();
  });
});
