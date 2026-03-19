import { getMessageSender } from "@/src/api/chat";
import type { Message } from "@/src/api/chat";

describe("getMessageSender", () => {
  it("returns nested sender when present", () => {
    const message: Message = {
      id: "1",
      conversationId: "c1",
      senderId: "u1",
      content: "Hello",
      createdAt: new Date().toISOString(),
      sender: { id: "u1", name: "Alice", image: "img.jpg" },
    };
    const sender = getMessageSender(message);
    expect(sender).toEqual({ id: "u1", name: "Alice", image: "img.jpg" });
  });

  it("falls back to flat sender fields", () => {
    const message: Message = {
      id: "2",
      conversationId: "c1",
      senderId: "u2",
      content: "Hi",
      createdAt: new Date().toISOString(),
      senderName: "Bob",
      senderImage: "bob.jpg",
    };
    const sender = getMessageSender(message);
    expect(sender).toEqual({ id: "u2", name: "Bob", image: "bob.jpg" });
  });

  it("returns nulls for missing sender info", () => {
    const message: Message = {
      id: "3",
      conversationId: "c1",
      senderId: "u3",
      content: "Hey",
      createdAt: new Date().toISOString(),
    };
    const sender = getMessageSender(message);
    expect(sender).toEqual({ id: "u3", name: null, image: null });
  });
});
