import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AddHyroxSheet } from "@/src/components/performance/AddHyroxSheet";

jest.mock("lucide-react-native", () => ({
  X: () => "X",
  ChevronDown: () => "ChevronDown",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  usePerformance: () => ({
    createEntry: jest.fn(),
    isCreating: false,
  }),
  parseTimeToSeconds: (str: string) => {
    const parts = str.split(":");
    if (parts.length === 3)
      return (
        parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
      );
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

describe("AddHyroxSheet", () => {
  const onClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders nothing when not visible", () => {
    const { toJSON } = render(
      <AddHyroxSheet visible={false} onClose={onClose} />
    );
    expect(toJSON()).toBeNull();
  });

  it("renders modal with title when visible", () => {
    const { getByText } = render(
      <AddHyroxSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.hyrox.addTitle")).toBeTruthy();
  });

  it("renders category picker, time, event name, and location fields", () => {
    const { getByText } = render(
      <AddHyroxSheet visible={true} onClose={onClose} />
    );
    expect(getByText(/performance\.hyrox\.category/)).toBeTruthy();
    expect(getByText("performance.hyrox.time *")).toBeTruthy();
    expect(getByText("performance.hyrox.eventName")).toBeTruthy();
    expect(getByText("performance.hyrox.location")).toBeTruthy();
  });

  it("renders save and cancel buttons", () => {
    const { getByText } = render(
      <AddHyroxSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.save")).toBeTruthy();
    expect(getByText("performance.cancel")).toBeTruthy();
  });

  it("calls onClose when cancel is pressed", () => {
    const { getByText } = render(
      <AddHyroxSheet visible={true} onClose={onClose} />
    );
    fireEvent.press(getByText("performance.cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows default category label", () => {
    const { getByText } = render(
      <AddHyroxSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.hyrox.categories.openMen")).toBeTruthy();
  });
});
