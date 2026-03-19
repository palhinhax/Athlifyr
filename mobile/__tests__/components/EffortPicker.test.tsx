import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EffortPicker } from "@/src/components/save-activity/EffortPicker";

describe("EffortPicker", () => {
  const onChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders 5 effort options", () => {
    const { getAllByText } = render(
      <EffortPicker perceivedEffort={undefined} onChange={onChange} />
    );
    // Each option has an emoji
    const emojis = ["😌", "🙂", "😤", "😰", "🥵"];
    emojis.forEach((emoji) => {
      expect(getAllByText(emoji).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("calls onChange when an option is pressed", () => {
    const { getByText } = render(
      <EffortPicker perceivedEffort={undefined} onChange={onChange} />
    );
    fireEvent.press(getByText("😤"));
    expect(onChange).toHaveBeenCalled();
  });

  it("renders with selected effort", () => {
    const { toJSON } = render(
      <EffortPicker perceivedEffort={3} onChange={onChange} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
