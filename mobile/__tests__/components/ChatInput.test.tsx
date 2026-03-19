import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChatInput } from "@/src/components/chat/ChatInput";

jest.mock("lucide-react-native", () => ({
  Send: () => "SendIcon",
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
}));

describe("ChatInput", () => {
  const onSend = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders text input with placeholder", () => {
    const { getByPlaceholderText } = render(<ChatInput onSend={onSend} />);
    expect(getByPlaceholderText("Type a message...")).toBeTruthy();
  });

  it("renders with custom placeholder", () => {
    const { getByPlaceholderText } = render(
      <ChatInput onSend={onSend} placeholder="Write something..." />
    );
    expect(getByPlaceholderText("Write something...")).toBeTruthy();
  });

  it("calls onSend with trimmed message", () => {
    const { getByPlaceholderText } = render(<ChatInput onSend={onSend} />);
    const input = getByPlaceholderText("Type a message...");
    fireEvent.changeText(input, "  Hello world  ");
    fireEvent(input, "submitEditing");
    expect(onSend).toHaveBeenCalledWith("Hello world");
  });

  it("does not send empty message", () => {
    const { getByPlaceholderText } = render(<ChatInput onSend={onSend} />);
    const input = getByPlaceholderText("Type a message...");
    fireEvent.changeText(input, "   ");
    fireEvent(input, "submitEditing");
    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears input after sending", () => {
    const { getByPlaceholderText } = render(<ChatInput onSend={onSend} />);
    const input = getByPlaceholderText("Type a message...");
    fireEvent.changeText(input, "Hello");
    fireEvent(input, "submitEditing");
    expect(input.props.value).toBe("");
  });
});
