/**
 * @jest-environment node
 */

import { submitAdminNote } from "@/lib/athli-ai/admin-notes";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    adminNote: {
      create: jest.fn(),
    },
  },
}));

const mockCreate = prisma.adminNote.create as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("submitAdminNote", () => {
  const userId = "user-1";
  const params = {
    type: "EVENT" as const,
    title: "Add Trail X",
    message: "Please add Trail X in Porto",
    location: "Porto",
    date: "2025-06-01",
    sportType: "TRAIL",
    url: "https://example.com",
  };

  it("creates an admin note and returns success", async () => {
    mockCreate.mockResolvedValue({
      id: "note-1",
      type: "EVENT",
      title: "Add Trail X",
    });

    const result = JSON.parse(await submitAdminNote(params, userId));

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId,
        type: "EVENT",
        title: "Add Trail X",
        message: "Please add Trail X in Porto",
        location: "Porto",
        date: "2025-06-01",
        sportType: "TRAIL",
        url: "https://example.com",
        status: "pending",
      },
    });
    expect(result.success).toBe(true);
    expect(result.noteId).toBe("note-1");
  });

  it("sets optional fields to null when not provided", async () => {
    mockCreate.mockResolvedValue({ id: "note-2", type: "OTHER", title: "Hi" });

    await submitAdminNote(
      { type: "OTHER", title: "Hi", message: "Hello" },
      userId
    );

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        location: null,
        date: null,
        sportType: null,
        url: null,
      }),
    });
  });

  it("returns error JSON when prisma throws", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"));

    const result = JSON.parse(await submitAdminNote(params, userId));

    expect(result.success).toBe(false);
    expect(result.error).toContain("Failed to submit");
  });
});
