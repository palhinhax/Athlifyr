import React from "react";
import { render } from "@testing-library/react-native";
import { CameraButton } from "@/src/components/CameraButton";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  Camera: () => "CameraIcon",
}));

describe("CameraButton", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<CameraButton />);
    expect(toJSON()).toBeTruthy();
  });
});
