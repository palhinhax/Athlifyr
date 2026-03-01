-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "commissionPercent" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Giveaway" ADD COLUMN     "winningTicketAttempts" INTEGER[];

-- AlterTable
ALTER TABLE "Venue" ALTER COLUMN "commissionValue" SET DEFAULT 0;
