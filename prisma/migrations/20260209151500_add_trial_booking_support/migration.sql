-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('NORMAL', 'TRIAL');

-- AlterEnum
-- Note: PENDING and REJECTED are added at the end to maintain existing ordering
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING';
ALTER TYPE "BookingStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN "enableTrialBooking" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VenueBooking" ADD COLUMN "bookingType" "BookingType" NOT NULL DEFAULT 'NORMAL';

-- CreateIndex
CREATE INDEX "VenueBooking_bookingType_idx" ON "VenueBooking"("bookingType");
