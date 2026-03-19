import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AddStrengthSheet } from "@/src/components/performance/AddStrengthSheet";

jest.mock("lucide-react-native", () => ({
  X: () => "X",
  Search: () => "Search",
  Plus: () => "Plus",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  usePerformance: () => ({
    createEntry: jest.fn(),
    isCreating: false,
  }),
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

jest.mock("@/src/lib/api", () => ({
  API_URL: "http://localhost:3000",
}));

describe("AddStrengthSheet", () => {
  const onClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders nothing when not visible", () => {
    const { toJSON } = render(
      <AddStrengthSheet visible={false} onClose={onClose} />
    );
    expect(toJSON()).toBeNull();
  });

  it("renders modal with title when visible", () => {
    const { getByText } = render(
      <AddStrengthSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.strength.addTitle")).toBeTruthy();
  });

  it("renders exercise search, reps, and weight fields", () => {
    const { getByText } = render(
      <AddStrengthSheet visible={true} onClose={onClose} />
    );
    expect(getByText(/performance\.strength\.exercise/)).toBeTruthy();
    expect(getByText(/performance\.strength\.reps/)).toBeTruthy();
    expect(getByText("performance.strength.weight *")).toBeTruthy();
  });

  it("renders save and cancel buttons", () => {
    const { getByText } = render(
      <AddStrengthSheet visible={true} onClose={onClose} />
    );
    expect(getByText("performance.save")).toBeTruthy();
    expect(getByText("performance.cancel")).toBeTruthy();
  });

  it("calls onClose when cancel is pressed", () => {
    const { getByText } = render(
      <AddStrengthSheet visible={true} onClose={onClose} />
    );
    fireEvent.press(getByText("performance.cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
