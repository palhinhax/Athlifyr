import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AddRunSheet } from "@/src/components/performance/AddRunSheet";

jest.mock("lucide-react-native", () => ({
  X: () => "X",
}));

const mockCreateEntry = jest.fn();
jest.mock("@/src/hooks/usePerformance", () => ({
  usePerformance: () => ({
    createEntry: mockCreateEntry,
    isCreating: false,
  }),
  parseTimeToSeconds: (str: string) => {
    const parts = str.split(":");
    if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    return 0;
  },
}));

jest.mock("@/src/hooks/useToast", () => ({
  useToast: () => ({
    toast: { visible: false, message: "", type: "info" },
    showToast: jest.fn(),
    hideToast: jest.fn(),
  }),
}));

jest.mock("@/src/components/ui/Toast", () => ({
  Toast: () => null,
}));

describe("AddRunSheet", () => {
  const onClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders nothing when not visible", () => {
    const { toJSON } = render(
      <AddRunSheet visible={false} onClose={onClose} />
    );
    expect(toJSON()).toBeNull();
  });

  it("renders modal with title when visible", () => {
    const { getByText } = render(
      <AddRunSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.run.addTitle")).toBeTruthy();
  });

  it("renders distance and time fields", () => {
    const { getByText } = render(
      <AddRunSheet visible={true} onClose={onClose} />
    );
    expect(getByText(/performance\.run\.distance/)).toBeTruthy();
    expect(getByText("performance.run.time *")).toBeTruthy();
  });

  it("renders elevation field", () => {
    const { getByText } = render(
      <AddRunSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.run.elevation")).toBeTruthy();
  });

  it("renders save and cancel buttons", () => {
    const { getByText } = render(
      <AddRunSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.save")).toBeTruthy();
    expect(getByText("performance.cancel")).toBeTruthy();
  });

  it("calls onClose when cancel is pressed", () => {
    const { getByText } = render(
      <AddRunSheet visible={true} onClose={onClose} />
    );
    fireEvent.press(getByText("performance.cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
