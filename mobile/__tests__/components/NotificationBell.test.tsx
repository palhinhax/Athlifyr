import React from "react";
import { render } from "@testing-library/react-native";
import { NotificationBell } from "@/src/components/NotificationBell";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("lucide-react-native", () => ({
  Bell: () => "BellIcon",
}));

const mockUnreadCount = jest.fn(() => 0);
jest.mock("@/src/hooks/useNotifications", () => ({
  useNotifications: () => ({
    unreadCount: mockUnreadCount(),
  }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnreadCount.mockReturnValue(0);
  });

  it("renders without crashing", () => {
    const { toJSON } = render(<NotificationBell />);
    expect(toJSON()).toBeTruthy();
  });

  it("does not show badge when unread count is 0", () => {
    const { queryByText } = render(<NotificationBell />);
    expect(queryByText("0")).toBeNull();
  });

  it("shows badge with unread count when > 0", () => {
    mockUnreadCount.mockReturnValue(5);
    const { getByText } = render(<NotificationBell />);
    expect(getByText("5")).toBeTruthy();
  });

  it("shows 9+ when unread count > 9", () => {
    mockUnreadCount.mockReturnValue(15);
    const { getByText } = render(<NotificationBell />);
    expect(getByText("9+")).toBeTruthy();
  });

  it("shows exact count for 9", () => {
    mockUnreadCount.mockReturnValue(9);
    const { getByText } = render(<NotificationBell />);
    expect(getByText("9")).toBeTruthy();
  });
});
