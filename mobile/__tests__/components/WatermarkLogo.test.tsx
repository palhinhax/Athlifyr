import React from "react";
import { render } from "@testing-library/react-native";
import { WatermarkLogo } from "@/src/components/WatermarkLogo";

jest.mock("@react-native-masked-view/masked-view", () => {
  const { View } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: ({
      maskElement,
      children,
    }: {
      maskElement: React.ReactNode;
      children: React.ReactNode;
    }) => (
      <View>
        {maskElement}
        {children}
      </View>
    ),
  };
});

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: () => "LinearGradient",
}));

describe("WatermarkLogo", () => {
  it("renders Athlifyr watermark", () => {
    const { getByText } = render(<WatermarkLogo />);
    expect(getByText("Athlifyr")).toBeTruthy();
  });

  it("renders with custom opacity", () => {
    const { toJSON } = render(<WatermarkLogo opacity={0.5} />);
    expect(toJSON()).toBeTruthy();
  });
});
