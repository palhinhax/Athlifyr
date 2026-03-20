import React from "react";
import { render } from "@testing-library/react-native";
import { GoogleIcon } from "@/src/components/GoogleIcon";

jest.mock("react-native-svg", () => {
  const { View, Text } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: ({ children, ...props }: React.ComponentProps<typeof View>) => (
      <View {...props}>{children}</View>
    ),
    Svg: ({ children, ...props }: React.ComponentProps<typeof View>) => (
      <View {...props}>{children}</View>
    ),
    Path: (props: { fill?: string }) => <Text>{props.fill || "path"}</Text>,
  };
});

describe("GoogleIcon", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<GoogleIcon />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom size", () => {
    const { toJSON } = render(<GoogleIcon size={30} />);
    expect(toJSON()).toBeTruthy();
  });
});
