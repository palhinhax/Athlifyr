import React from "react";
import { render } from "@testing-library/react-native";
import { CreatePostBox } from "@/src/components/CreatePostBox";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock("lucide-react-native", () => ({
  ImagePlus: () => "ImagePlus",
  Send: () => "Send",
  X: () => "X",
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedAvatar: () => "CachedAvatar",
}));

jest.mock("@/src/lib/api", () => ({
  api: { post: jest.fn() },
}));

const mockUser = { name: "Alice", image: null };

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ user: mockUser }),
}));

describe("CreatePostBox", () => {
  it("renders when user is authenticated", () => {
    const { getByPlaceholderText } = render(<CreatePostBox />);
    expect(getByPlaceholderText("feed.createPost.placeholder")).toBeTruthy();
  });

  it("renders user initial when no image", () => {
    const { getByText } = render(<CreatePostBox />);
    expect(getByText("A")).toBeTruthy();
  });
});
