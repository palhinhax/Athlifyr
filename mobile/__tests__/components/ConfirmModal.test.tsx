import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

jest.mock("lucide-react-native", () => ({
  X: () => "XIcon",
}));

describe("ConfirmModal", () => {
  const onClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders title when visible", () => {
    const { getByText } = render(
      <ConfirmModal visible={true} onClose={onClose} title="Delete item?" />
    );
    expect(getByText("Delete item?")).toBeTruthy();
  });

  it("renders message when provided", () => {
    const { getByText } = render(
      <ConfirmModal
        visible={true}
        onClose={onClose}
        title="Delete?"
        message="This cannot be undone."
      />
    );
    expect(getByText("This cannot be undone.")).toBeTruthy();
  });

  it("does not render message when not provided", () => {
    const { queryByText } = render(
      <ConfirmModal visible={true} onClose={onClose} title="Delete?" />
    );
    expect(queryByText("This cannot be undone.")).toBeNull();
  });

  it("renders action buttons", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmModal
        visible={true}
        onClose={onClose}
        title="Delete?"
        actions={[
          { label: "Cancel", variant: "outline", onPress: onClose },
          { label: "Delete", variant: "destructive", onPress: onConfirm },
        ]}
      />
    );
    expect(getByText("Cancel")).toBeTruthy();
    expect(getByText("Delete")).toBeTruthy();
  });

  it("calls action onPress when button pressed", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmModal
        visible={true}
        onClose={onClose}
        title="Delete?"
        actions={[{ label: "Confirm", onPress: onConfirm }]}
      />
    );
    fireEvent.press(getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders icon when provided", () => {
    const { toJSON } = render(
      <ConfirmModal
        visible={true}
        onClose={onClose}
        title="Alert"
        icon={<></>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
