import React from "react";
import { render } from "@testing-library/react-native";
import { Toast } from "@/src/components/ui/Toast";

jest.mock("lucide-react-native", () => ({
  CheckCircle: () => "CheckCircleIcon",
  XCircle: () => "XCircleIcon",
  AlertCircle: () => "AlertCircleIcon",
  X: () => "XIcon",
}));

describe("Toast", () => {
  const onDismiss = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders message when visible", () => {
    const { getByText } = render(
      <Toast visible={true} message="Saved!" onDismiss={onDismiss} />
    );
    expect(getByText("Saved!")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <Toast visible={false} message="Saved!" onDismiss={onDismiss} />
    );
    expect(queryByText("Saved!")).toBeNull();
  });

  it("renders with success type by default", () => {
    const { getByText } = render(
      <Toast visible={true} message="Success!" onDismiss={onDismiss} />
    );
    expect(getByText("Success!")).toBeTruthy();
  });

  it("renders with error type", () => {
    const { getByText } = render(
      <Toast
        visible={true}
        message="Error!"
        type="error"
        onDismiss={onDismiss}
      />
    );
    expect(getByText("Error!")).toBeTruthy();
  });

  it("renders with different message types", () => {
    const types = ["success", "error", "info", "warning"] as const;
    types.forEach((type) => {
      const { getByText, unmount } = render(
        <Toast
          visible={true}
          message={`Test ${type}`}
          type={type}
          onDismiss={onDismiss}
        />
      );
      expect(getByText(`Test ${type}`)).toBeTruthy();
      unmount();
    });
  });
});
