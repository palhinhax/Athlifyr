-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "defaultBookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "defaultCancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "defaultSessionCapacity" INTEGER;
