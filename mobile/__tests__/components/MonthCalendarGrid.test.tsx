import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MonthCalendarGrid } from "@/src/components/schedule/MonthCalendarGrid";

jest.mock("lucide-react-native", () => ({
  ChevronLeft: () => "ChevronLeft",
  ChevronRight: () => "ChevronRight",
  Calendar: () => "Calendar",
}));

describe("MonthCalendarGrid", () => {
  const baseProps = {
    currentMonth: new Date(2025, 5, 1), // June 2025
    selectedDay: new Date(2025, 5, 15),
    activitiesByDay: { "2025-06-15": 2, "2025-06-20": 1 },
    onDaySelect: jest.fn(),
    onPreviousMonth: jest.fn(),
    onNextMonth: jest.fn(),
    onToday: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders month label", () => {
    const { getByText } = render(<MonthCalendarGrid {...baseProps} />);
    // English is default from i18n mock
    expect(getByText("June 2025")).toBeTruthy();
  });

  it("renders weekday headers", () => {
    const { getByText } = render(<MonthCalendarGrid {...baseProps} />);
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Sun")).toBeTruthy();
  });

  it("renders day numbers", () => {
    const { getAllByText } = render(<MonthCalendarGrid {...baseProps} />);
    // "1" may appear in both current and adjacent months
    expect(getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("15").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("30").length).toBeGreaterThanOrEqual(1);
  });

  it("renders today button", () => {
    const { getByText } = render(<MonthCalendarGrid {...baseProps} />);
    expect(getByText("schedule.today")).toBeTruthy();
  });

  it("calls onDaySelect when a day is pressed", () => {
    const { getByText } = render(<MonthCalendarGrid {...baseProps} />);
    fireEvent.press(getByText("10"));
    expect(baseProps.onDaySelect).toHaveBeenCalled();
  });

  it("calls onPreviousMonth", () => {
    const { getByText } = render(<MonthCalendarGrid {...baseProps} />);
    fireEvent.press(getByText("schedule.today"));
    expect(baseProps.onToday).toHaveBeenCalled();
  });
});
