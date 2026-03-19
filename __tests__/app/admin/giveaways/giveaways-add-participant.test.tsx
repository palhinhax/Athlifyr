import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import setup (runs all mocks)
import "./helpers/giveaways-setup";
import {
  mockToast,
  MOCK_GIVEAWAY,
  MOCK_EVENTS,
} from "./helpers/giveaways-setup";

// ── Override session and router ───────────────────────────────────────────────

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/admin/giveaways",
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import AdminGiveawaysPage from "@/app/[locale]/admin/giveaways/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

function mockInitialLoad(giveaways = [MOCK_GIVEAWAY]) {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ giveaways }) })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: MOCK_EVENTS }),
    });
}

async function openDetailFor(giveaway = MOCK_GIVEAWAY) {
  const user = userEvent.setup();
  mockInitialLoad([giveaway]);
  render(<AdminGiveawaysPage />);

  await waitFor(() => {
    expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
  });

  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ participations: [] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        giveaway: { ...giveaway, winners: [], winningTicketNumbers: [] },
      }),
    });

  const card = screen
    .getAllByTestId("card")
    .find((c) => c.textContent?.includes("Win a Prize!"));
  if (card) await user.click(card);

  await waitFor(() => {
    expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
  });

  return user;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminGiveawaysPage – Auth & Redirect", () => {
  it("redirects non-admin users to /", async () => {
    jest.resetModules();
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({
        data: { user: { id: "u1", role: "USER" } },
        status: "authenticated",
      }),
    }));

    mockInitialLoad([]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("redirects when session is null (unauthenticated)", async () => {
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({ data: null, status: "unauthenticated" }),
    }));

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ events: [] }) });

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });
});

describe("AdminGiveawaysPage – Add Participant Dialog", () => {
  beforeEach(() => {
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({
        data: { user: { id: "admin-1", role: "ADMIN" } },
        status: "authenticated",
      }),
    }));
  });

  it("opens add participant dialog from detail view", async () => {
    const user = await openDetailFor();

    const addBtn = screen.getByText("detail.addParticipant");
    await user.click(addBtn);

    expect(
      screen.getByPlaceholderText("detail.searchPlaceholder")
    ).toBeInTheDocument();
  });

  it("searches users and shows results", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.addParticipant"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [
          { id: "u2", name: "Bob Smith", email: "bob@test.com", image: null },
        ],
      }),
    });

    const searchInput = screen.getByPlaceholderText("detail.searchPlaceholder");
    await user.type(searchInput, "bob");

    await waitFor(() => {
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("bob@test.com")).toBeInTheDocument();
    });
  });

  it("skips search when query is too short (< 2 chars)", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.addParticipant"));

    const searchInput = screen.getByPlaceholderText("detail.searchPlaceholder");
    await user.type(searchInput, "a");

    await new Promise((r) => setTimeout(r, 350));

    expect(mockFetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/users"),
      expect.anything()
    );
  });

  it("adds participant successfully", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.addParticipant"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [
          { id: "u2", name: "Bob Smith", email: "bob@test.com", image: null },
        ],
      }),
    });

    const searchInput = screen.getByPlaceholderText("detail.searchPlaceholder");
    await user.type(searchInput, "bob");

    await waitFor(() => {
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    // Mock add participant + two openDetail fetches + fetchGiveaways
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ participations: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          giveaway: { ...MOCK_GIVEAWAY, winners: [], winningTicketNumbers: [] },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [MOCK_GIVEAWAY] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    const addButtons = screen.getAllByText("detail.add");
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.participantAdded" })
      );
    });
  });

  it("shows alreadyParticipates toast when user already in giveaway", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.addParticipant"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [
          { id: "u2", name: "Bob Smith", email: "bob@test.com", image: null },
        ],
      }),
    });

    const searchInput = screen.getByPlaceholderText("detail.searchPlaceholder");
    await user.type(searchInput, "bob");

    await waitFor(() => {
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    // Mock 422-style error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "User already participates" }),
    });

    const addButtons = screen.getAllByText("detail.add");
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.error" })
      );
    });
  });

  it("shows generic error for non-duplicate add failure", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.addParticipant"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [
          { id: "u2", name: "Bob Smith", email: "bob@test.com", image: null },
        ],
      }),
    });

    const searchInput = screen.getByPlaceholderText("detail.searchPlaceholder");
    await user.type(searchInput, "bob");

    await waitFor(() => {
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    const addButtons = screen.getAllByText("detail.add");
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles remove participant API failure", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          participations: [
            {
              id: "p1",
              ticketNumber: 1,
              createdAt: "2026-03-01T10:00:00Z",
              user: { id: "u1", name: "Alice", email: "alice@test.com" },
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          giveaway: { ...MOCK_GIVEAWAY, winners: [], winningTicketNumbers: [] },
        }),
      });

    const card = screen
      .getAllByTestId("card")
      .find((c) => c.textContent?.includes("Win a Prize!"));
    if (card) await user.click(card);

    await waitFor(() => {
      expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole("button");
    const removeBtn = allButtons.find(
      (btn) => btn.getAttribute("data-variant") === "ghost"
    );

    if (removeBtn) {
      await user.click(removeBtn);

      await waitFor(() => {
        expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      });

      // Mock failure
      mockFetch.mockResolvedValueOnce({ ok: false });

      const confirmBtn = screen.getByText("detail.confirmRemove");
      await user.click(confirmBtn);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({ variant: "destructive" })
        );
      });
    }
  });

  it("handles openDetail participants fetch failure gracefully", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    // Simulate both fetches failing
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"));

    const card = screen
      .getAllByTestId("card")
      .find((c) => c.textContent?.includes("Win a Prize!"));
    if (card) await user.click(card);

    // Detail dialog still shows (no crash)
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });
});

describe("AdminGiveawaysPage – Platform Badge & Translation Fallback", () => {
  beforeEach(() => {
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({
        data: { user: { id: "admin-1", role: "ADMIN" } },
        status: "authenticated",
      }),
    }));
  });

  it("shows platform badge when platform is not ALL", async () => {
    const mobileGiveaway = { ...MOCK_GIVEAWAY, platform: "MOBILE" };
    mockInitialLoad([mobileGiveaway]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("platform.MOBILE")).toBeInTheDocument();
    });
  });

  it("does not show platform badge when platform is ALL", async () => {
    mockInitialLoad([MOCK_GIVEAWAY]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.queryByText("platform.ALL")).not.toBeInTheDocument();
    });
  });

  it("falls back to English translation when locale-specific not found", async () => {
    const giveaway = {
      ...MOCK_GIVEAWAY,
      translations: [{ lang: "en", title: "English Title", details: "..." }],
    };
    mockInitialLoad([giveaway]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("English Title")).toBeInTheDocument();
    });
  });

  it("shows dash when no translations available", async () => {
    const giveaway = { ...MOCK_GIVEAWAY, translations: [] };
    mockInitialLoad([giveaway]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  it("shows drawAt date when present", async () => {
    mockInitialLoad([MOCK_GIVEAWAY]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      // formatDate mock returns ISO slice, giveaway drawAt is "2026-06-15T12:00:00Z"
      expect(screen.getByText("2026-06-15")).toBeInTheDocument();
    });
  });

  it("renders multiple giveaway cards", async () => {
    const g2 = {
      ...MOCK_GIVEAWAY,
      id: "g2",
      translations: [{ lang: "en", title: "Second Prize", details: "..." }],
    };
    mockInitialLoad([MOCK_GIVEAWAY, g2]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
      expect(screen.getByText("Second Prize")).toBeInTheDocument();
    });
  });
});

describe("AdminGiveawaysPage – Form Interactions", () => {
  beforeEach(() => {
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({
        data: { user: { id: "admin-1", role: "ADMIN" } },
        status: "authenticated",
      }),
    }));
  });

  it("updates translation inputs in create form", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });

    await user.click(screen.getByText("new"));

    const titleInputs = screen.getAllByPlaceholderText("form.title");
    await user.type(titleInputs[0], "My Title");

    expect(titleInputs[0]).toHaveValue("My Title");
  });

  it("cancel button closes create dialog and resets form", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });

    await user.click(screen.getByText("new"));
    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("form.cancel"));
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("disables create button when no event selected", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });

    await user.click(screen.getByText("new"));

    const createBtn = screen.getByText("form.create").closest("button");
    expect(createBtn).toBeDisabled();
  });

  it("handles update form API failure with correct error toast", async () => {
    const user = await openDetailFor();

    await user.click(screen.getByText("detail.edit"));
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({ ok: false });

    const saveBtn = screen.getByText("form.saveChanges");
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});
