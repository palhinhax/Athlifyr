import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { EmptyState } from "@/src/components/profile/EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        icon={<Text>📭</Text>}
        title="No results"
        description="Try a different search"
      />
    );

    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.getByText("Try a different search")).toBeTruthy();
  });

  it("renders the icon node", () => {
    render(
      <EmptyState
        icon={<Text testID="empty-icon">🔍</Text>}
        title="Nothing here"
        description="Check back later"
      />
    );

    expect(screen.getByTestId("empty-icon")).toBeTruthy();
  });

  it("renders with different props", () => {
    render(
      <EmptyState
        icon={<Text>⚡</Text>}
        title="All caught up"
        description="No new notifications"
      />
    );

    expect(screen.getByText("All caught up")).toBeTruthy();
    expect(screen.getByText("No new notifications")).toBeTruthy();
  });
});
