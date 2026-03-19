import React from "react";
import { render } from "@testing-library/react-native";
import { DateSeparator } from "@/src/components/chat/DateSeparator";

jest.mock("date-fns", () => {
  const actual = jest.requireActual("date-fns");
  return {
    ...actual,
    isToday: jest.fn(),
    isYesterday: jest.fn(),
    differenceInDays: jest.fn(),
    format: jest.fn(),
  };
});

import { isToday, isYesterday, differenceInDays, format } from "date-fns";

const mockIsToday = isToday as jest.MockedFunction<typeof isToday>;
const mockIsYesterday = isYesterday as jest.MockedFunction<typeof isYesterday>;
const mockDiffInDays = differenceInDays as jest.MockedFunction<
  typeof differenceInDays
>;
const mockFormat = format as jest.MockedFunction<typeof format>;

describe("DateSeparator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsToday.mockReturnValue(false);
    mockIsYesterday.mockReturnValue(false);
    mockDiffInDays.mockReturnValue(30);
    mockFormat.mockReturnValue("Mar 01, 2025");
  });

  it("shows Today for today's date", () => {
    mockIsToday.mockReturnValue(true);
    const { getByText } = render(<DateSeparator date={new Date()} />);
    expect(getByText("Today")).toBeTruthy();
  });

  it("shows Yesterday for yesterday's date", () => {
    mockIsYesterday.mockReturnValue(true);
    const { getByText } = render(
      <DateSeparator date={new Date(Date.now() - 86400000)} />
    );
    expect(getByText("Yesterday")).toBeTruthy();
  });

  it("shows day name for dates within last 7 days", () => {
    mockDiffInDays.mockReturnValue(3);
    mockFormat.mockReturnValue("Wednesday");
    const { getByText } = render(
      <DateSeparator date={new Date(Date.now() - 3 * 86400000)} />
    );
    expect(getByText("Wednesday")).toBeTruthy();
  });

  it("shows formatted date for older dates", () => {
    mockFormat.mockReturnValue("Jan 15, 2025");
    const { getByText } = render(<DateSeparator date="2025-01-15" />);
    expect(getByText("Jan 15, 2025")).toBeTruthy();
  });

  it("accepts string date", () => {
    mockFormat.mockReturnValue("Dec 25, 2024");
    const { getByText } = render(<DateSeparator date="2024-12-25" />);
    expect(getByText("Dec 25, 2024")).toBeTruthy();
  });
});
