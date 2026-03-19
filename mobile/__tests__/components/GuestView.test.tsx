import React from "react";
import { render } from "@testing-library/react-native";
import { GuestView } from "@/src/components/profile/GuestView";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  User: () => "UserIcon",
}));

describe("GuestView", () => {
  it("renders sign-in title", () => {
    const { getByText } = render(<GuestView />);
    expect(getByText("profile.signInTitle")).toBeTruthy();
  });

  it("renders sign-in description", () => {
    const { getByText } = render(<GuestView />);
    expect(getByText("profile.signInDescription")).toBeTruthy();
  });

  it("renders sign-in button", () => {
    const { getByText } = render(<GuestView />);
    expect(getByText("profile.signInButton")).toBeTruthy();
  });
});
