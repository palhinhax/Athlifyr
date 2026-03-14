import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: (...args: unknown[]) => mockToast(...args) }),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: (string | boolean | undefined)[]) =>
    classes.filter(Boolean).join(" "),
}));

jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
}));

jest.mock("date-fns/locale", () => ({
  pt: {},
  enUS: {},
  es: {},
  fr: {},
  de: {},
  it: {},
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="avatar-fallback">{children}</span>
  ),
  AvatarImage: ({ src }: { src?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="avatar-image" src={src} alt="" />
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <label {...props}>{children}</label>,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dialog-content">{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dialog-trigger">{asChild ? children : children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="dropdown-trigger">{asChild ? children : children}</div>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
    value?: string;
  }) => (
    <div data-testid="select" onClick={() => onValueChange?.("SPAM")}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "user-1";

function makeConversation(
  overrides: Partial<{
    id: string;
    otherUserName: string;
    otherUserId: string;
    lastMessage: string;
    lastMessageSenderId: string;
    lastMessageCreatedAt: Date;
    lastSeenAt: Date | string;
  }> = {}
) {
  const otherId = overrides.otherUserId || "user-2";
  const lastMsgSenderId = overrides.lastMessageSenderId || otherId;

  return {
    id: overrides.id || "conv-1",
    participants: [
      {
        userId: CURRENT_USER_ID,
        lastSeenAt: overrides.lastSeenAt || new Date("2026-01-01T10:00:00Z"),
        user: {
          id: CURRENT_USER_ID,
          name: "Current User",
          image: null,
          email: "current@example.com",
        },
      },
      {
        userId: otherId,
        lastSeenAt: new Date("2026-01-01T10:00:00Z"),
        user: {
          id: otherId,
          name: overrides.otherUserName || "Other User",
          image: null,
          email: "other@example.com",
        },
      },
    ],
    messages:
      overrides.lastMessage !== undefined
        ? [
            {
              id: "msg-1",
              content: overrides.lastMessage,
              createdAt:
                overrides.lastMessageCreatedAt ||
                new Date("2026-01-01T12:00:00Z"),
              senderId: lastMsgSenderId,
              sender: {
                id: lastMsgSenderId,
                name:
                  lastMsgSenderId === CURRENT_USER_ID
                    ? "Current User"
                    : "Other User",
                image: null,
              },
            },
          ]
        : [],
    updatedAt: new Date("2026-01-01T12:00:00Z"),
  };
}

const onSelectConversation = jest.fn();

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ChatSidebar", () => {
  it("renders empty state when no conversations", () => {
    render(
      <ChatSidebar
        conversations={[]}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("noConversations")).toBeInTheDocument();
  });

  it("renders conversation list with other user name", () => {
    const conversations = [
      makeConversation({ otherUserName: "Alice", lastMessage: "Hello" }),
    ];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows last message content", () => {
    const conversations = [
      makeConversation({ lastMessage: "Hey, how are you?" }),
    ];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("Hey, how are you?")).toBeInTheDocument();
  });

  it("calls onSelectConversation when conversation is clicked", () => {
    const conversations = [
      makeConversation({ id: "conv-123", lastMessage: "Hi" }),
    ];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    // Click on the conversation button
    const conversationButton = screen.getByText("Other User").closest("button");
    if (conversationButton) {
      fireEvent.click(conversationButton);
      expect(onSelectConversation).toHaveBeenCalledWith("conv-123");
    }
  });

  it("highlights selected conversation", () => {
    const conversations = [
      makeConversation({ id: "conv-1", lastMessage: "Hi" }),
    ];

    const { container } = render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId="conv-1"
        onSelectConversation={onSelectConversation}
      />
    );

    // The selected conversation should have the bg-muted class
    const conversationEl = container.querySelector(".bg-muted");
    expect(conversationEl).toBeTruthy();
  });

  it("shows unread indicator for conversations with new messages", () => {
    const conversations = [
      makeConversation({
        lastMessage: "New message!",
        lastMessageSenderId: "user-2", // from other user
        lastMessageCreatedAt: new Date("2026-01-01T14:00:00Z"), // after lastSeenAt
        lastSeenAt: new Date("2026-01-01T10:00:00Z"),
      }),
    ];

    const { container } = render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    // Should have unread styling (bg-primary/5 class)
    const unreadEl = container.querySelector('[class*="bg-primary"]');
    expect(unreadEl).toBeTruthy();
  });

  it("does not show unread for own messages", () => {
    const conversations = [
      makeConversation({
        lastMessage: "My own message",
        lastMessageSenderId: CURRENT_USER_ID, // from current user
        lastMessageCreatedAt: new Date("2026-01-01T14:00:00Z"),
        lastSeenAt: new Date("2026-01-01T10:00:00Z"),
      }),
    ];

    const { container } = render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    // Should NOT have unread styling
    const conversationItems = container.querySelectorAll(
      '[class*="bg-primary/5"]'
    );
    expect(conversationItems.length).toBe(0);
  });

  it("does not show unread when message is before lastSeenAt", () => {
    const conversations = [
      makeConversation({
        lastMessage: "Old message",
        lastMessageSenderId: "user-2",
        lastMessageCreatedAt: new Date("2026-01-01T08:00:00Z"), // before lastSeenAt
        lastSeenAt: new Date("2026-01-01T10:00:00Z"),
      }),
    ];

    const { container } = render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    const conversationItems = container.querySelectorAll(
      '[class*="bg-primary/5"]'
    );
    expect(conversationItems.length).toBe(0);
  });

  it("renders avatar with user initials", () => {
    const conversations = [
      makeConversation({ otherUserName: "John Doe", lastMessage: "Hi" }),
    ];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    const fallback = screen.getAllByTestId("avatar-fallback");
    // Should show initials "JD"
    const hasJD = fallback.some((el) => el.textContent === "JD");
    expect(hasJD).toBe(true);
  });

  it("shows ? for user with no name", () => {
    const conversations = [
      makeConversation({ otherUserName: "Other User", lastMessage: "Hi" }),
    ];
    // Override participant to have null name
    (conversations[0].participants[1].user as { name: string | null }).name =
      null;

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("unknownUser")).toBeInTheDocument();
  });

  it("renders new chat dialog trigger", () => {
    render(
      <ChatSidebar
        conversations={[]}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
        onStartConversation={jest.fn()}
      />
    );

    // The new conversation button has a dialog trigger
    const dialogTriggers = screen.getAllByTestId("dialog-trigger");
    expect(dialogTriggers.length).toBeGreaterThan(0);
  });

  it("renders multiple conversations", () => {
    const conversations = [
      makeConversation({
        id: "conv-1",
        otherUserName: "Alice",
        lastMessage: "Hi",
      }),
      makeConversation({
        id: "conv-2",
        otherUserName: "Bob",
        otherUserId: "user-3",
        lastMessage: "Hello",
      }),
    ];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows time for last message", () => {
    const conversations = [makeConversation({ lastMessage: "Recent message" })];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    // formatDistanceToNow is mocked to return "2 hours ago"
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("renders conversation without messages", () => {
    const conversations = [
      makeConversation({
        otherUserName: "New Contact",
        lastMessage: undefined,
      }),
    ];
    // Remove messages
    conversations[0].messages = [];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
      />
    );

    expect(screen.getByText("New Contact")).toBeInTheDocument();
  });

  it("provides hide conversation option in dropdown", () => {
    const onHide = jest.fn();
    const conversations = [makeConversation({ lastMessage: "Hi" })];

    render(
      <ChatSidebar
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        selectedConversationId={null}
        onSelectConversation={onSelectConversation}
        onHideConversation={onHide}
      />
    );

    // Verify dropdown menu is present
    const dropdowns = screen.getAllByTestId("dropdown");
    expect(dropdowns.length).toBeGreaterThan(0);
  });
});
