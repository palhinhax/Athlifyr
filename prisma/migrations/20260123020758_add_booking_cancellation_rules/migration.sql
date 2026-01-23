-- AlterTable
ALTER TABLE "VenueRecurringSession" ADD COLUMN     "bookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "cancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "VenueSession" ADD COLUMN     "bookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "cancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30;
