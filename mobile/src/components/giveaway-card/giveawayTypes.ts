export interface GiveawayTranslation {
  lang: string;
  title: string;
  details: string;
}

export interface GiveawayData {
  id: string;
  status: "DRAFT" | "SCHEDULED" | "DRAWING" | "DRAWN" | "CANCELLED";
  drawAt: string | null;
  drawnAt: string | null;
  prizeCount: number;
  participantsCount: number;
  secretHash: string | null;
  secretRevealed: string | null;
  finalParticipantsCount: number | null;
  winningTicketNumbers: number[];
  winningTicketAttempts: number[];
  isWinner: boolean;
  translation: GiveawayTranslation | null;
  hasJoined: boolean;
  ticketNumber: number | null;
}
