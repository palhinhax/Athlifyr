import React from "react";
import { render } from "@testing-library/react-native";
import { HeaderLogo } from "@/src/components/HeaderLogo";

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

describe("HeaderLogo", () => {
  it("renders Athlifyr text", () => {
    const { getByText } = render(<HeaderLogo />);
    expect(getByText("Athlifyr")).toBeTruthy();
  });
});
