import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import setup (runs all mocks)
import {
  mockToast,
  MOCK_GIVEAWAY,
  MOCK_EVENTS,
  MOCK_SCHEDULED_GIVEAWAY,
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

function mockInitialLoad(giveaways = [MOCK_GIVEAWAY]) {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ giveaways }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: MOCK_EVENTS }),
    });
}

async function renderAndWait(giveaways = [MOCK_GIVEAWAY]) {
  mockInitialLoad(giveaways);
  render(<AdminGiveawaysPage />);
  await waitFor(() => {
    expect(
      screen.queryByText("noGiveaways") || screen.queryByText("Win a Prize!")
    ).toBeInTheDocument();
  });
}

async function openDetailDialog(
  user: ReturnType<typeof userEvent.setup>,
  giveaway = MOCK_GIVEAWAY
) {
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

  const giveawayCard = screen
    .getAllByTestId("card")
    .find((c) => c.textContent?.includes("Win a Prize!"));
  if (giveawayCard) await user.click(giveawayCard);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminGiveawaysPage – Actions", () => {
  it("opens create dialog when clicking 'new' button", async () => {
    const user = userEvent.setup();
    await renderAndWait([]);

    const newBtn = screen.getByText("new");
    await user.click(newBtn);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("opens detail dialog when clicking a giveaway card", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
    });
  });

  it("calls handleDraw when draw button clicked in draft detail", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByText("detail.drawNow")).toBeInTheDocument();
    });

    // Mock draw API call + refetch
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

    await user.click(screen.getByText("detail.drawNow"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.drawn" })
      );
    });
  });

  it("calls handleDelete when delete button clicked in draft detail", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByText("detail.deleteGiveaway")).toBeInTheDocument();
    });

    // Mock delete API + refetch
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

    await user.click(screen.getByText("detail.deleteGiveaway"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.deleted" })
      );
    });
  });

  it("calls handlePublish when publish button clicked in draft detail", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByText("detail.publish")).toBeInTheDocument();
    });

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

    await user.click(screen.getByText("detail.publish"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "toast.updated" })
      );
    });
  });

  it("shows cancel button for SCHEDULED giveaways", async () => {
    const user = userEvent.setup();
    mockInitialLoad([MOCK_SCHEDULED_GIVEAWAY]);
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user, MOCK_SCHEDULED_GIVEAWAY);

    await waitFor(() => {
      expect(screen.getByText("detail.cancelGiveaway")).toBeInTheDocument();
      expect(screen.getByText("detail.drawNow")).toBeInTheDocument();
    });
  });

  it("shows draw error on handleDraw failure", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByText("detail.drawNow")).toBeInTheDocument();
    });

    // Mock draw API failure
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await user.click(screen.getByText("detail.drawNow"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("shows delete error on handleDelete failure", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    await openDetailDialog(user);

    await waitFor(() => {
      expect(screen.getByText("detail.deleteGiveaway")).toBeInTheDocument();
    });

    // Mock delete API failure
    mockFetch.mockRejectedValueOnce(new Error("fail"));

    await user.click(screen.getByText("detail.deleteGiveaway"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});
