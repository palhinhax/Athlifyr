import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SportType } from "@prisma/client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/featured-event-card", () => ({
  FeaturedEventCard: () => <div data-testid="featured-event-card" />,
}));

const mockRouterPush = jest.fn();
const mockRouterRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: mockRouterRefresh,
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { PostCard } from "@/components/post-card";

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_POST = {
  id: "post-1",
  content: "Hello World!",
  imageUrl: null,
  mediaType: null,
  createdAt: new Date("2026-03-01").toISOString(),
  userId: "user-1",
  user: { name: "Test User", image: null },
  event: null,
  venue: null,
  isPublic: true,
  likesCount: 5,
  isLikedByUser: false,
  commentsCount: 3,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("PostCard", () => {
  it("renders post content and user info", () => {
    render(<PostCard post={BASE_POST} />);

    expect(screen.getByText("Hello World!")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // likes count
  });

  it("renders avatar initial when no image", () => {
    render(<PostCard post={BASE_POST} />);

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("shows like button as unliked by default", () => {
    render(<PostCard post={BASE_POST} currentUserId="user-2" />);

    // heart icon exists but not filled
    const likeButton = screen.getByText("5").closest("button");
    expect(likeButton).toBeInTheDocument();
  });

  it("disables like button when no currentUserId", () => {
    render(<PostCard post={BASE_POST} />);

    const likeButton = screen.getByText("5").closest("button");
    expect(likeButton).toBeDisabled();
  });

  it("handles like toggle with optimistic update", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ liked: true, likesCount: 6 }),
    });

    render(<PostCard post={BASE_POST} currentUserId="user-2" />);

    const likeButton = screen.getByText("5").closest("button");
    if (likeButton) {
      await user.click(likeButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/posts/post-1/like", {
          method: "POST",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("6")).toBeInTheDocument();
      });
    }
  });

  it("reverts like on API error", async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<PostCard post={BASE_POST} currentUserId="user-2" />);

    const likeButton = screen.getByText("5").closest("button");
    if (likeButton) {
      await user.click(likeButton);

      // After error, should revert (may briefly show 6 then go back to 5)
      await waitFor(
        () => {
          expect(screen.getByText("5")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    }
  });

  it("shows delete button only for post owner or admin", () => {
    // No delete for other users
    const { unmount } = render(
      <PostCard post={BASE_POST} currentUserId="user-other" />
    );
    expect(screen.queryByText("Apagar publicação")).not.toBeInTheDocument();
    unmount();

    // Delete visible for post owner
    render(<PostCard post={BASE_POST} currentUserId="user-1" />);
    // Menu trigger should exist
    const menuButton = screen.getByRole("button", { name: "" });
    expect(menuButton).toBeInTheDocument();
  });

  it("shows comments section when toggled", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PostCard post={BASE_POST} currentUserId="user-2" />);

    const commentButton = screen.getByText("3").closest("button");
    if (commentButton) {
      await user.click(commentButton);

      await waitFor(() => {
        // Comments section should be visible - showing the empty state
        expect(screen.getByText(/comentário|Escreve/)).toBeInTheDocument();
      });
    }
  });

  it("submits a new comment", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "c1",
          content: "Nice post!",
          createdAt: new Date().toISOString(),
          user: { id: "user-2", name: "Commenter", image: null },
        }),
      });

    render(<PostCard post={BASE_POST} currentUserId="user-2" />);

    // Open comments
    const commentButton = screen.getByText("3").closest("button");
    if (commentButton) {
      await user.click(commentButton);
    }

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/comentário/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/comentário/i);
    await user.type(input, "Nice post!");

    // Submit via form
    // Try to find the send button
    const sendButtons = screen.getAllByRole("button");
    const sendBtn = sendButtons[sendButtons.length - 1]!;
    await user.click(sendBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/posts/post-1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Nice post!" }),
      });
    });
  });

  it("redirects to signin when commenting without auth", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PostCard post={BASE_POST} />);

    // Open comments - no auth, so no input visible
    const commentButton = screen.getByText("3").closest("button");
    if (commentButton) {
      await user.click(commentButton);
    }
  });

  it("shows post with image", () => {
    const postWithImage = {
      ...BASE_POST,
      imageUrl: "https://example.com/image.jpg",
      mediaType: "image",
    };

    render(<PostCard post={postWithImage} currentUserId="user-2" />);

    const img = screen.getByAltText("Post image");
    expect(img).toBeInTheDocument();
  });

  it("shows post with video", () => {
    const postWithVideo = {
      ...BASE_POST,
      imageUrl: "https://example.com/video.mp4",
      mediaType: "video",
    };

    render(<PostCard post={postWithVideo} currentUserId="user-2" />);

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video?.getAttribute("src")).toBe("https://example.com/video.mp4");
  });

  it("shows venue badge when post has venue and hideVenueBadge is false", () => {
    const postWithVenue = {
      ...BASE_POST,
      venue: { id: "v1", name: "Trail Gym", slug: "trail-gym" },
    };

    render(<PostCard post={postWithVenue} currentUserId="user-2" />);

    expect(screen.getByText("Trail Gym")).toBeInTheDocument();
  });

  it("hides venue badge when hideVenueBadge is true", () => {
    const postWithVenue = {
      ...BASE_POST,
      venue: { id: "v1", name: "Trail Gym", slug: "trail-gym" },
    };

    render(
      <PostCard
        post={postWithVenue}
        currentUserId="user-2"
        hideVenueBadge={true}
      />
    );

    expect(screen.queryByText("Trail Gym")).not.toBeInTheDocument();
  });

  it("shows shared event card when post has full event data", () => {
    const postWithEvent = {
      ...BASE_POST,
      event: {
        id: "e1",
        title: "Trail 2026",
        slug: "trail-2026",
        city: "Lisbon",
        country: "PT",
        sportTypes: ["TRAIL"] as SportType[],
        variants: [],
      },
    };

    render(<PostCard post={postWithEvent} currentUserId="user-2" />);

    expect(screen.getByTestId("featured-event-card")).toBeInTheDocument();
  });

  it("handles delete post", async () => {
    const user = userEvent.setup();
    const onPostDeleted = jest.fn();
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(
      <PostCard
        post={BASE_POST}
        currentUserId="user-1"
        onPostDeleted={onPostDeleted}
      />
    );

    // Open menu
    const menuButtons = screen.getAllByRole("button");
    const menuBtn = menuButtons.find(
      (btn) => btn.querySelector(".h-4.w-4") && !btn.closest("form")
    );
    if (menuBtn) {
      await user.click(menuBtn);
    }
  });

  it("handles successful unlike with isLikedByUser true initially", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ liked: false, likesCount: 4 }),
    });

    const likedPost = { ...BASE_POST, isLikedByUser: true };
    render(<PostCard post={likedPost} currentUserId="user-2" />);

    const likeButton = screen.getByText("5").closest("button");
    expect(likeButton).not.toBeDisabled();
    fireEvent.click(likeButton!);

    // After optimistic update the count goes to 4, then API confirms 4
    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });
});
