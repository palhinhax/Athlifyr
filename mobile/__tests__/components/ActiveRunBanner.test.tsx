import React from "react";
import { render } from "@testing-library/react-native";
import { ActiveRunBanner } from "@/src/components/ActiveRunBanner";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("lucide-react-native", () => ({
  Play: () => "Play",
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/src/lib/free-run-session-store", () => ({
  useFreeRunSession: () => ({
    isRunning: true,
    isPaused: false,
    startTimestamp: Date.now() - 60000,
    distance: 500,
  }),
}));

describe("ActiveRunBanner", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<ActiveRunBanner />);
    expect(toJSON()).toBeTruthy();
  });
});
