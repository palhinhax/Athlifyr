-- AlterTable: replace commitHash/revealedSecret with new proof fields
ALTER TABLE "Giveaway" RENAME COLUMN "commitHash" TO "secretHash";
ALTER TABLE "Giveaway" RENAME COLUMN "revealedSecret" TO "secretRevealed";
ALTER TABLE "Giveaway" ADD COLUMN "drawnAt" TIMESTAMP(3);
ALTER TABLE "Giveaway" ADD COLUMN "finalParticipantsCount" INTEGER;
ALTER TABLE "Giveaway" ADD COLUMN "winningTicketNumber" INTEGER;

-- AlterTable: add ticketNumber to GiveawayParticipation
-- Use 0 as a temporary default so existing rows (if any) get a value
ALTER TABLE "GiveawayParticipation" ADD COLUMN "ticketNumber" INTEGER NOT NULL DEFAULT 0;
-- Remove the default so future inserts must provide an explicit value
ALTER TABLE "GiveawayParticipation" ALTER COLUMN "ticketNumber" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayParticipation_giveawayId_ticketNumber_key" ON "GiveawayParticipation"("giveawayId", "ticketNumber");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_giveawayId_ticketNumber_idx" ON "GiveawayParticipation"("giveawayId", "ticketNumber");
