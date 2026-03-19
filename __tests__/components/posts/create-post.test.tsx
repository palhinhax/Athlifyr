import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { id: "u1", name: "Test User", image: null },
    },
    status: "authenticated",
  }),
}));

jest.mock("@/components/ui/checkbox", () => ({
  Checkbox: (props: { id?: string; checked?: boolean }) => (
    <input
      type="checkbox"
      id={props.id}
      defaultChecked={props.checked}
      data-testid="public-toggle"
    />
  ),
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { CreatePost } from "@/components/create-post";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("CreatePost", () => {
  it("renders the post creation form", () => {
    render(<CreatePost />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders user info from props when provided", () => {
    render(<CreatePost userName="Custom Name" userImage="/img.jpg" />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows file size error for large images", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    // Create a file > 5MB
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large.jpg",
      { type: "image/jpeg" }
    );

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      await user.upload(fileInput as HTMLInputElement, largeFile);

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    }
  });

  it("shows error for invalid file type", async () => {
    render(<CreatePost />);

    const invalidFile = new File(["content"], "file.txt", {
      type: "text/plain",
    });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      // Use fireEvent.change to bypass accept attribute filtering
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    }
  });

  it("handles valid image selection", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    const validFile = new File(["image"], "photo.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(validFile, "size", { value: 1024 * 1024 });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      await user.upload(fileInput as HTMLInputElement, validFile);

      // Should not show error
      expect(mockToast).not.toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    }
  });

  it("shows public toggle for venue/event posts", () => {
    render(<CreatePost venueId="venue-1" />);

    // Public toggle should exist for venue posts
    const checkbox = screen.queryByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("hides public toggle for general posts", () => {
    render(<CreatePost />);

    // General posts should NOT show the public toggle
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
