import React from "react";
import { render } from "@testing-library/react-native";
import { ChatMessage } from "@/src/components/chat/ChatMessage";
import type { Message } from "@/src/api/chat";

jest.mock("date-fns", () => ({
  format: jest.fn(() => "14:30"),
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedAvatar: ({ alt }: { alt: string }) => `Avatar-${alt}`,
}));

jest.mock("@/src/api/chat", () => ({
  getMessageSender: (msg: Message) =>
    msg.sender || { id: msg.senderId, name: null, image: null },
}));

const baseMessage: Message = {
  id: "msg-1",
  conversationId: "conv-1",
  senderId: "user-2",
  content: "Hello there!",
  createdAt: "2025-06-01T14:30:00Z",
  sender: { id: "user-2", name: "Alice", image: "alice.jpg" },
};

describe("ChatMessage", () => {
  it("renders message content", () => {
    const { getByText } = render(
      <ChatMessage message={baseMessage} isOwnMessage={false} />
    );
    expect(getByText("Hello there!")).toBeTruthy();
  });

  it("renders timestamp", () => {
    const { getByText } = render(
      <ChatMessage message={baseMessage} isOwnMessage={false} />
    );
    expect(getByText("14:30")).toBeTruthy();
  });

  it("shows avatar for other user messages", () => {
    const { toJSON } = render(
      <ChatMessage message={baseMessage} isOwnMessage={false} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).toContain("Avatar-Alice");
  });

  it("does not show avatar for own messages", () => {
    const { toJSON } = render(
      <ChatMessage message={baseMessage} isOwnMessage={true} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).not.toContain("Avatar-Alice");
  });

  it("shows placeholder when sender has no image", () => {
    const msg: Message = {
      ...baseMessage,
      sender: { id: "user-2", name: "Bob", image: null },
    };
    const { getByText } = render(
      <ChatMessage message={msg} isOwnMessage={false} />
    );
    expect(getByText("B")).toBeTruthy();
  });

  it("shows ? when sender has no name", () => {
    const msg: Message = {
      ...baseMessage,
      sender: { id: "user-2", name: null, image: null },
    };
    const { getByText } = render(
      <ChatMessage message={msg} isOwnMessage={false} />
    );
    expect(getByText("?")).toBeTruthy();
  });
});
