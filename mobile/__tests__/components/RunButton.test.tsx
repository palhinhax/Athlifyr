import React from "react";
import { render } from "@testing-library/react-native";
import { RunButton } from "@/src/components/RunButton";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  Play: () => "PlayIcon",
}));

describe("RunButton", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<RunButton />);
    expect(toJSON()).toBeTruthy();
  });
});
