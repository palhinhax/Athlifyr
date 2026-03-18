import React from "react";
import { render, screen } from "@testing-library/react-native";
import { SportBadge } from "@/src/components/SportBadge";

// react-i18next is already mocked in jest.setup.ts

describe("SportBadge", () => {
  it("renders sport type text", () => {
    render(<SportBadge sportType="RUNNING" />);

    // The mock t() returns the defaultValue (sportType) when key has defaultValue option
    expect(screen.getByText("RUNNING")).toBeTruthy();
  });

  it("renders sport icon by default", () => {
    render(<SportBadge sportType="RUNNING" />);

    // The icon emoji should be rendered
    expect(screen.getByText("🏃")).toBeTruthy();
  });

  it("hides icon when showIcon is false", () => {
    render(<SportBadge sportType="RUNNING" showIcon={false} />);

    expect(screen.queryByText("🏃")).toBeNull();
  });

  it("renders with different sport types", () => {
    const { rerender } = render(<SportBadge sportType="TRAIL" />);
    expect(screen.getByText("🥾")).toBeTruthy();

    rerender(<SportBadge sportType="CYCLING" />);
    expect(screen.getByText("🚴")).toBeTruthy();
  });

  it("handles unknown sport type gracefully", () => {
    render(<SportBadge sportType="UNKNOWN" />);

    // Falls back to OTHER icon
    expect(screen.getByText("📍")).toBeTruthy();
  });
});
