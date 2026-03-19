import React from "react";
import { render } from "@testing-library/react-native";
import { OtherSections } from "@/src/components/profile/OtherSections";

// Mock the child components
jest.mock("@/src/components/profile/ProfileGallery", () => ({
  ProfileGallery: () => "ProfileGallery",
}));

jest.mock("@/src/components/profile/FriendsSection", () => ({
  FriendsSection: ({ friendsCount }: { friendsCount: number }) =>
    `FriendsSection-${friendsCount}`,
}));

describe("OtherSections", () => {
  it("renders ProfileGallery", () => {
    const { toJSON } = render(<OtherSections friendsCount={5} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain("ProfileGallery");
  });

  it("renders FriendsSection with friendsCount", () => {
    const { toJSON } = render(<OtherSections friendsCount={10} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain("FriendsSection-10");
  });
});
