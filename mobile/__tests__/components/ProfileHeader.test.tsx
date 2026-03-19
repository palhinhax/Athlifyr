import React from "react";
import { render, screen } from "@testing-library/react-native";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock CachedImage
jest.mock("@/src/components/CachedImage", () => {
  const { Text } = jest.requireActual("react-native");
  return {
    CachedAvatar: ({ alt }: { alt: string }) => <Text>{alt}</Text>,
  };
});

describe("ProfileHeader", () => {
  const mockUser = {
    id: "user-1",
    name: "João Silva",
    email: "joao@example.com",
    image: "https://example.com/avatar.jpg",
  };

  it("renders user name and email", () => {
    render(<ProfileHeader user={mockUser} />);

    // Name appears in both CachedAvatar alt and user info section
    expect(screen.getAllByText("João Silva").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("joao@example.com")).toBeTruthy();
  });

  it("renders photo management buttons", () => {
    render(<ProfileHeader user={mockUser} />);

    expect(screen.getByText("profile.changePhoto")).toBeTruthy();
    expect(screen.getByText("profile.removePhoto")).toBeTruthy();
  });

  it("renders calendar button", () => {
    render(<ProfileHeader user={mockUser} />);

    expect(screen.getByText("profile.calendar")).toBeTruthy();
  });

  it("renders avatar when user has image", () => {
    render(<ProfileHeader user={mockUser} />);

    // CachedAvatar mock renders the alt text which matches user name
    expect(screen.getAllByText("João Silva").length).toBeGreaterThanOrEqual(2);
  });

  it("renders placeholder when user has no image", () => {
    const userWithoutImage = {
      ...mockUser,
      image: null,
    };

    render(<ProfileHeader user={userWithoutImage} />);

    // User name should still be visible
    expect(screen.getByText("João Silva")).toBeTruthy();
  });

  it("handles null user name gracefully", () => {
    const userWithoutName = {
      ...mockUser,
      name: null as string | null,
    };

    render(<ProfileHeader user={userWithoutName} />);

    expect(screen.getByText("joao@example.com")).toBeTruthy();
  });
});
