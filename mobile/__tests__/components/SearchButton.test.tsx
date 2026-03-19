import React from "react";
import { render } from "@testing-library/react-native";
import { SearchButton } from "@/src/components/SearchButton";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lucide-react-native", () => ({
  Search: () => "SearchIcon",
}));

describe("SearchButton", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<SearchButton />);
    expect(toJSON()).toBeTruthy();
  });
});
