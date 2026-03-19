/**
 * Athli AI — Admin note submission
 */

import { prisma } from "@/lib/prisma";

export interface SubmitAdminNoteParams {
  type: "EVENT" | "VENUE" | "OTHER";
  title: string;
  message: string;
  location?: string;
  date?: string;
  sportType?: string;
  url?: string;
}

export async function submitAdminNote(
  params: SubmitAdminNoteParams,
  userId: string
): Promise<string> {
  try {
    const note = await prisma.adminNote.create({
      data: {
        userId,
        type: params.type,
        title: params.title,
        message: params.message,
        location: params.location || null,
        date: params.date || null,
        sportType: params.sportType || null,
        url: params.url || null,
        status: "pending",
      },
    });

    return JSON.stringify({
      success: true,
      noteId: note.id,
      type: note.type,
      title: note.title,
      message:
        "Request submitted successfully. The Athlifyr team will review it.",
    });
  } catch (error) {
    console.error("Error submitting admin note:", error);
    return JSON.stringify({
      success: false,
      error: "Failed to submit request. Please try again later.",
    });
  }
}
