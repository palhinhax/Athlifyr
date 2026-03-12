import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminEventSuggestions } from "@/components/admin-event-suggestions";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock AdminNoteCard as a simple div to avoid its dependencies
jest.mock("@/components/admin-note-card", () => ({
  AdminNoteCard: ({
    note,
    onStatusChange,
    onDelete,
  }: {
    note: { id: string; title: string; status: string };
    onStatusChange: (id: string, status: string) => void;
    onAdminNotesChange: (id: string, notes: string) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid={`note-${note.id}`}>
      <span data-testid={`note-title-${note.id}`}>{note.title}</span>
      <span data-testid={`note-status-${note.id}`}>{note.status}</span>
      <button
        data-testid={`resolve-${note.id}`}
        onClick={() => onStatusChange(note.id, "resolved")}
      >
        Resolve
      </button>
      <button
        data-testid={`delete-${note.id}`}
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  ),
}));

// Mock the Badge component
jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => <span {...props}>{children}</span>,
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOTE_1 = {
  id: "n1",
  userId: "u1",
  type: "EVENT" as const,
  title: "Trail Run Suggestion",
  message: "Please add this event",
  location: "Lisbon",
  date: "2026-06-01",
  sportType: "TRAIL",
  url: null,
  status: "pending",
  adminNotes: null,
  createdAt: new Date().toISOString(),
  user: { id: "u1", name: "User 1", email: "u1@test.com", image: null },
};

const NOTE_2 = {
  id: "n2",
  userId: "u2",
  type: "EVENT" as const,
  title: "Road Race Suggestion",
  message: "Great road race",
  location: "Porto",
  date: null,
  sportType: "ROAD",
  url: null,
  status: "resolved",
  adminNotes: null,
  createdAt: new Date().toISOString(),
  user: { id: "u2", name: "User 2", email: "u2@test.com", image: null },
};

const VENUE_NOTE = {
  ...NOTE_1,
  id: "n3",
  type: "VENUE" as const,
  title: "Venue Suggestion",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("AdminEventSuggestions", () => {
  it("shows loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves

    render(<AdminEventSuggestions />);

    // The Loader2 icon has animate-spin class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows empty state when no event suggestions exist", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: [] }),
    });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByText("Sem sugestões de eventos.")).toBeInTheDocument();
    });
  });

  it("filters to show only EVENT type notes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: [NOTE_1, VENUE_NOTE] }),
    });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByTestId("note-n1")).toBeInTheDocument();
    });

    // VENUE_NOTE should be filtered out
    expect(screen.queryByTestId("note-n3")).not.toBeInTheDocument();
  });

  it("shows suggestions count and pending badge", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: [NOTE_1, NOTE_2] }),
    });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByText("2 sugestões")).toBeInTheDocument();
      expect(screen.getByText("1 pendentes")).toBeInTheDocument();
    });
  });

  it("handles status change", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notes: [NOTE_1] }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByTestId("note-n1")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("resolve-n1"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/notes/n1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
    });
  });

  it("handles delete", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notes: [NOTE_1] }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByTestId("note-n1")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("delete-n1"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/notes/n1", {
        method: "DELETE",
      });
    });
  });

  it("handles fetch error gracefully", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByText("Sem sugestões de eventos.")).toBeInTheDocument();
    });
  });

  it("handles network error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AdminEventSuggestions />);

    await waitFor(() => {
      expect(screen.getByText("Sem sugestões de eventos.")).toBeInTheDocument();
    });
  });
});
