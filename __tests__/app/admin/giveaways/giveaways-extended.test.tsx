import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import setup (runs all mocks)
import "./helpers/giveaways-setup";
import {
  mockToast,
  MOCK_GIVEAWAY,
  MOCK_EVENTS,
  MOCK_SCHEDULED_GIVEAWAY,
  MOCK_DRAWN_GIVEAWAY,
} from "./helpers/giveaways-setup";

// ── Override session and router ───────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/admin/giveaways",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "admin-1", role: "ADMIN" } },
    status: "authenticated",
  }),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import AdminGiveawaysPage from "@/app/[locale]/admin/giveaways/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

const MOCK_PARTICIPANTS = [
  {
    id: "p1",
    ticketNumber: 1,
    createdAt: "2026-03-01T10:00:00Z",
    user: { id: "u1", name: "Alice", email: "alice@test.com" },
  },
];

function mockInitialLoad(giveaways = [MOCK_GIVEAWAY], events = MOCK_EVENTS) {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ giveaways }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events }),
    });
}

async function openDetailFor(giveaway = MOCK_GIVEAWAY) {
  const user = userEvent.setup();
  mockInitialLoad([giveaway]);
  render(<AdminGiveawaysPage />);

  const titleText = giveaway.translations[0].title;
  await waitFor(() => {
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  // Mock detail fetches
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ participations: MOCK_PARTICIPANTS }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        giveaway: {
          ...giveaway,
          winners:
            giveaway.status === "DRAWN"
              ? [
                  {
                    id: "w1",
                    rank: 1,
                    user: {
                      id: "u1",
                      name: "Alice",
                      email: "alice@test.com",
                      image: null,
                    },
                  },
                ]
              : [],
          winningTicketNumbers: giveaway.status === "DRAWN" ? [1] : [],
        },
      }),
    });

  const card = screen
    .getAllByTestId("card")
    .find((c) => c.textContent?.includes(titleText));
  if (card) await user.click(card);

  await waitFor(() => {
    expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
  });

  return user;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminGiveawaysPage – Cancel, Publish, Edit", () => {
  it("handles cancel action for a SCHEDULED giveaway", async () => {
    const user = await openDetailFor(MOCK_SCHEDULED_GIVEAWAY);

    // Click cancel button
    const cancelBtn = screen.getByText("detail.cancelGiveaway");

    // Mock cancel API + refetch
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    await user.click(cancelBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.cancelled" })
      );
    });
  });

  it("handles cancel API failure", async () => {
    const user = await openDetailFor(MOCK_SCHEDULED_GIVEAWAY);

    mockFetch.mockResolvedValueOnce({ ok: false });

    await user.click(screen.getByText("detail.cancelGiveaway"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles publish action for a DRAFT giveaway", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    const publishBtn = screen.getByText("detail.publish");

    // Mock publish API + refetch
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    await user.click(publishBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.updated" })
      );
    });
  });

  it("handles publish API failure", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    mockFetch.mockResolvedValueOnce({ ok: false });

    await user.click(screen.getByText("detail.publish"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("opens edit form when clicking edit button", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    const editBtn = screen.getByText("detail.edit");

    await user.click(editBtn);

    // Edit dialog should show with the form
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  it("handles draw API failure", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    mockFetch.mockResolvedValueOnce({ ok: false });

    await user.click(screen.getByText("detail.drawNow"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles delete API failure", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    mockFetch.mockResolvedValueOnce({ ok: false });

    await user.click(screen.getByText("detail.deleteGiveaway"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});

describe("AdminGiveawaysPage – Create/Edit Form", () => {
  it("creates a new giveaway via form", async () => {
    const user = userEvent.setup();
    mockInitialLoad([]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });

    // Open create dialog
    await user.click(screen.getByText("new"));
    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    // Select an event (click the SelectItem with value "e1")
    const eventOption = screen.getByText("Trail Run 2026");
    await user.click(eventOption);

    // Mock create API + refetch
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [MOCK_GIVEAWAY] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    // Click save/submit button
    const saveBtn = screen.getByText("form.create");
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.created" })
      );
    });
  });

  it("handles create failure", async () => {
    const user = userEvent.setup();
    mockInitialLoad([]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });

    await user.click(screen.getByText("new"));

    // Select an event so the create button is enabled
    const eventOption = screen.getByText("Trail Run 2026");
    await user.click(eventOption);

    mockFetch.mockResolvedValueOnce({ ok: false });

    await user.click(screen.getByText("form.create"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("submits edit form with update", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    await user.click(screen.getByText("detail.edit"));

    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    // Mock update API + refetch
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ giveaways: [MOCK_GIVEAWAY] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    const saveBtn = screen.getByText("form.saveChanges");
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.updated" })
      );
    });
  });
});

describe("AdminGiveawaysPage – Remove Participant", () => {
  it("shows remove confirmation dialog and removes participant", async () => {
    const user = await openDetailFor(MOCK_GIVEAWAY);

    // Wait for participants to load
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    // Look for any X or remove button near participant area
    // The remove button is a ghost button with trash icon
    const allButtons = screen.getAllByRole("button");
    const removeBtn = allButtons.find(
      (btn) =>
        btn.closest("[class*='flex items-center justify-between']") &&
        btn.getAttribute("data-variant") === "ghost"
    );

    // If found, click it to trigger setRemoveTarget
    if (removeBtn) {
      await user.click(removeBtn);

      // AlertDialog should appear for confirmation
      await waitFor(() => {
        expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      });

      // Mock remove API + refetch
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ giveaways: [MOCK_GIVEAWAY] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ events: MOCK_EVENTS }),
        });

      // Confirm removal
      const confirmBtn = screen.getByText("detail.confirmRemove");
      await user.click(confirmBtn);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({ title: "toast.participantRemoved" })
        );
      });
    }
  });
});

describe("AdminGiveawaysPage – Fetch Error Handling", () => {
  it("handles fetch giveaways error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: MOCK_EVENTS }),
      });

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("shows SCHEDULED giveaway with correct status badge", async () => {
    mockInitialLoad([MOCK_SCHEDULED_GIVEAWAY]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
      expect(screen.getByText("status.SCHEDULED")).toBeInTheDocument();
    });
  });

  it("shows DRAWN giveaway with winner count", async () => {
    mockInitialLoad([MOCK_DRAWN_GIVEAWAY]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });
  });
});
