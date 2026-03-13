import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuggestEventDialog } from "@/components/suggest-event-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "suggest.title": "Suggest an Event",
      "suggest.description": "Fill in the details to suggest an event",
      "suggest.eventName": "Event Name",
      "suggest.eventNamePlaceholder": "e.g. Trail Run 2026",
      "suggest.date": "Date",
      "suggest.sport": "Sport",
      "suggest.sportPlaceholder": "Select a sport",
      "suggest.location": "Location",
      "suggest.locationPlaceholder": "e.g. Lisbon, Portugal",
      "suggest.website": "Website",
      "suggest.websitePlaceholder": "https://...",
      "suggest.message": "Message",
      "suggest.messagePlaceholder": "Why should we add this event?",
      "suggest.submit": "Submit",
      "suggest.close": "Close",
      "suggest.thankYouTitle": "Thank You!",
      "suggest.thankYouDesc": "Your suggestion has been submitted.",
    };
    return translations[key] ?? key;
  },
}));

const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("@prisma/client", () => ({
  SportType: {
    TRAIL: "TRAIL",
    ROAD: "ROAD",
    CYCLING: "CYCLING",
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderDialog(open = true, onOpenChange = jest.fn()) {
  return render(<SuggestEventDialog open={open} onOpenChange={onOpenChange} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSession.mockReturnValue({
    data: { user: { id: "u1", name: "Test User" } },
    status: "authenticated",
  });
});

describe("SuggestEventDialog", () => {
  it("renders nothing when user is not authenticated", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    const { container } = renderDialog();

    expect(container.innerHTML).toBe("");
  });

  it("renders the dialog form when open and authenticated", () => {
    renderDialog();

    expect(screen.getByText("Suggest an Event")).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("submit button is disabled when required fields are empty", () => {
    renderDialog();

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeDisabled();
  });

  it("submit button is enabled when required fields are filled", async () => {
    const user = userEvent.setup();
    renderDialog();

    const titleInput = screen.getByPlaceholderText("e.g. Trail Run 2026");
    const messageInput = screen.getByPlaceholderText(
      "Why should we add this event?"
    );

    await user.type(titleInput, "Trail Run 2026");
    await user.type(messageInput, "Great event!");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeEnabled();
  });

  it("submits the form and shows success state", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, id: "note-1" }),
    });

    renderDialog();

    const titleInput = screen.getByPlaceholderText("e.g. Trail Run 2026");
    const messageInput = screen.getByPlaceholderText(
      "Why should we add this event?"
    );

    await user.type(titleInput, "Trail Run 2026");
    await user.type(messageInput, "Great trail event!");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Thank You!")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/event-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.stringContaining("Trail Run 2026"),
    });
  });

  it("keeps form open on submission error", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    renderDialog();

    const titleInput = screen.getByPlaceholderText("e.g. Trail Run 2026");
    const messageInput = screen.getByPlaceholderText(
      "Why should we add this event?"
    );

    await user.type(titleInput, "Trail Run 2026");
    await user.type(messageInput, "Great trail event!");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      // Form should still be visible, not success state
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange when closing after success", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, id: "note-1" }),
    });

    renderDialog(true, onOpenChange);

    const titleInput = screen.getByPlaceholderText("e.g. Trail Run 2026");
    const messageInput = screen.getByPlaceholderText(
      "Why should we add this event?"
    );

    await user.type(titleInput, "Trail Run 2026");
    await user.type(messageInput, "Great trail event!");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Thank You!")).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    // First Close button is the one inside our success content, second is the dialog X
    fireEvent.click(closeButtons[0]);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
