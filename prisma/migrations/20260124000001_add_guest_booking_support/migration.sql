-- AlterTable
ALTER TABLE "VenueBooking" 
  DROP CONSTRAINT IF EXISTS "VenueBooking_sessionId_userId_key",
  ALTER COLUMN "userId" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "guestName" TEXT,
  ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
