import React from "react";
import { render, screen } from "@testing-library/react-native";
import { ProfileStats } from "@/src/components/profile/ProfileStats";

// react-i18next is already mocked in jest.setup.ts

describe("ProfileStats", () => {
  it("renders all three stat values", () => {
    render(
      <ProfileStats
        stats={{ upcomingEvents: 3, pastEvents: 12, friendsCount: 45 }}
      />
    );

    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("45")).toBeTruthy();
  });

  it("renders stat labels", () => {
    render(
      <ProfileStats
        stats={{ upcomingEvents: 0, pastEvents: 0, friendsCount: 0 }}
      />
    );

    expect(screen.getByText("profile.upcomingEvents")).toBeTruthy();
    expect(screen.getByText("profile.pastEvents")).toBeTruthy();
    expect(screen.getByText("profile.friends")).toBeTruthy();
  });

  it("renders zero stats correctly", () => {
    render(
      <ProfileStats
        stats={{ upcomingEvents: 0, pastEvents: 0, friendsCount: 0 }}
      />
    );

    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(3);
  });

  it("handles large numbers", () => {
    render(
      <ProfileStats
        stats={{ upcomingEvents: 999, pastEvents: 1500, friendsCount: 250 }}
      />
    );

    expect(screen.getByText("999")).toBeTruthy();
    expect(screen.getByText("1500")).toBeTruthy();
    expect(screen.getByText("250")).toBeTruthy();
  });
});
