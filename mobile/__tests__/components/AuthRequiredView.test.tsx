import React from "react";
import { render } from "@testing-library/react-native";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { User } from "lucide-react-native";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  User: () => "UserIcon",
}));

describe("AuthRequiredView", () => {
  it("renders title from translation key", () => {
    const { getByText } = render(
      <AuthRequiredView
        icon={User}
        titleKey="feed.authTitle"
        descriptionKey="feed.authDescription"
      />
    );
    expect(getByText("feed.authTitle")).toBeTruthy();
  });

  it("renders description from translation key", () => {
    const { getByText } = render(
      <AuthRequiredView
        icon={User}
        titleKey="feed.authTitle"
        descriptionKey="feed.authDescription"
      />
    );
    expect(getByText("feed.authDescription")).toBeTruthy();
  });

  it("renders sign in button", () => {
    const { getByText } = render(
      <AuthRequiredView
        icon={User}
        titleKey="feed.authTitle"
        descriptionKey="feed.authDescription"
      />
    );
    expect(getByText("common.signInButton")).toBeTruthy();
  });
});
