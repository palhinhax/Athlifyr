import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EventFAQ } from "@/src/components/EventFAQ";

jest.mock("lucide-react-native", () => ({
  HelpCircle: () => "HelpCircleIcon",
  ChevronDown: () => "ChevronDownIcon",
  ChevronUp: () => "ChevronUpIcon",
}));

const items = [
  { id: "1", question: "What time does it start?", answer: "8:00 AM" },
  { id: "2", question: "Is parking available?", answer: "Yes, free parking." },
];

describe("EventFAQ", () => {
  it("renders nothing for empty items", () => {
    const { toJSON } = render(<EventFAQ items={[]} />);
    expect(toJSON()).toBeNull();
  });

  it("renders FAQ header", () => {
    const { getByText } = render(<EventFAQ items={items} />);
    expect(getByText("Frequently Asked Questions")).toBeTruthy();
  });

  it("renders all questions", () => {
    const { getByText } = render(<EventFAQ items={items} />);
    expect(getByText("What time does it start?")).toBeTruthy();
    expect(getByText("Is parking available?")).toBeTruthy();
  });

  it("does not show answer by default", () => {
    const { queryByText } = render(<EventFAQ items={items} />);
    expect(queryByText("8:00 AM")).toBeNull();
  });

  it("shows answer when question is tapped", () => {
    const { getByText } = render(<EventFAQ items={items} />);
    fireEvent.press(getByText("What time does it start?"));
    expect(getByText("8:00 AM")).toBeTruthy();
  });

  it("hides answer when tapped again", () => {
    const { getByText, queryByText } = render(<EventFAQ items={items} />);
    fireEvent.press(getByText("What time does it start?"));
    expect(getByText("8:00 AM")).toBeTruthy();
    fireEvent.press(getByText("What time does it start?"));
    expect(queryByText("8:00 AM")).toBeNull();
  });

  it("only one answer is expanded at a time", () => {
    const { getByText, queryByText } = render(<EventFAQ items={items} />);
    fireEvent.press(getByText("What time does it start?"));
    expect(getByText("8:00 AM")).toBeTruthy();
    fireEvent.press(getByText("Is parking available?"));
    expect(getByText("Yes, free parking.")).toBeTruthy();
    expect(queryByText("8:00 AM")).toBeNull();
  });
});
