import React from "react";
import { render } from "@testing-library/react-native";
import { MuteToggle } from "@/src/components/save-activity/MuteToggle";

describe("MuteToggle", () => {
  const onChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders mute activity title", () => {
    const { getByText } = render(
      <MuteToggle muted={false} onChange={onChange} />
    );
    expect(getByText("saveActivity.muteActivity")).toBeTruthy();
  });

  it("renders switch component", () => {
    const { toJSON } = render(<MuteToggle muted={false} onChange={onChange} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with muted state", () => {
    const { toJSON } = render(<MuteToggle muted={true} onChange={onChange} />);
    expect(toJSON()).toBeTruthy();
  });
});
