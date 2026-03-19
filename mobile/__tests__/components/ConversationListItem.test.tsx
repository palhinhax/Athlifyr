import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConversationListItem } from "@/src/components/chat/ConversationListItem";
import type { Conversation } from "@/src/api/chat";

jest.mock("date-fns", () => ({
  formatDistanceToNow: jest.fn(() => "2 min"),
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedAvatar: ({ alt }: { alt: string }) => `Avatar-${alt}`,
}));

const makeConversation = (overrides?: Partial<Conversation>): Conversation => ({
  id: "conv-1",
  updatedAt: new Date().toISOString(),
  participants: [
    {
      userId: "me",
      lastSeenAt: new Date().toISOString(),
      user: { id: "me", name: "Me", image: null, email: "me@test.com" },
    },
    {
      userId: "other",
      lastSeenAt: new Date().toISOString(),
      user: {
        id: "other",
        name: "Alice",
        image: "alice.jpg",
        email: "alice@test.com",
      },
    },
  ],
  messages: [
    {
      id: "msg-1",
      content: "Hey there!",
      createdAt: new Date().toISOString(),
      senderId: "other",
    },
  ],
  ...overrides,
});

describe("ConversationListItem", () => {
  const onPress = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders other user name", () => {
    const { getByText } = render(
      <ConversationListItem
        conversation={makeConversation()}
        currentUserId="me"
        onPress={onPress}
      />
    );
    expect(getByText("Alice")).toBeTruthy();
  });

  it("renders last message preview", () => {
    const { getByText } = render(
      <ConversationListItem
        conversation={makeConversation()}
        currentUserId="me"
        onPress={onPress}
      />
    );
    expect(getByText("Hey there!")).toBeTruthy();
  });

  it("renders timestamp", () => {
    const { getByText } = render(
      <ConversationListItem
        conversation={makeConversation()}
        currentUserId="me"
        onPress={onPress}
      />
    );
    expect(getByText("2 min")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByText } = render(
      <ConversationListItem
        conversation={makeConversation()}
        currentUserId="me"
        onPress={onPress}
      />
    );
    fireEvent.press(getByText("Alice"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows You: prefix for own messages", () => {
    const conv = makeConversation({
      messages: [
        {
          id: "msg-2",
          content: "My reply",
          createdAt: new Date().toISOString(),
          senderId: "me",
        },
      ],
    });
    const { getByText } = render(
      <ConversationListItem
        conversation={conv}
        currentUserId="me"
        onPress={onPress}
      />
    );
    expect(getByText("You: My reply")).toBeTruthy();
  });

  it("shows Unknown User when no other participant", () => {
    const conv = makeConversation({
      participants: [
        {
          userId: "me",
          lastSeenAt: new Date().toISOString(),
          user: { id: "me", name: "Me", image: null, email: "me@test.com" },
        },
      ],
    });
    const { getByText } = render(
      <ConversationListItem
        conversation={conv}
        currentUserId="me"
        onPress={onPress}
      />
    );
    expect(getByText("Unknown User")).toBeTruthy();
  });
});
