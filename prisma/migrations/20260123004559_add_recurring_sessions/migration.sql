-- AlterTable
ALTER TABLE "VenueSession" ADD COLUMN     "recurringSessionId" TEXT;

-- CreateTable
CREATE TABLE "VenueRecurringSession" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER,
    "coachId" TEXT,
    "serviceId" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueRecurringSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueRecurringSession_venueId_idx" ON "VenueRecurringSession"("venueId");

-- CreateIndex
CREATE INDEX "VenueRecurringSession_dayOfWeek_idx" ON "VenueRecurringSession"("dayOfWeek");

-- CreateIndex
CREATE INDEX "VenueRecurringSession_isActive_idx" ON "VenueRecurringSession"("isActive");

-- CreateIndex
CREATE INDEX "VenueSession_recurringSessionId_idx" ON "VenueSession"("recurringSessionId");

-- AddForeignKey
ALTER TABLE "VenueRecurringSession" ADD CONSTRAINT "VenueRecurringSession_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSession" ADD CONSTRAINT "VenueSession_recurringSessionId_fkey" FOREIGN KEY ("recurringSessionId") REFERENCES "VenueRecurringSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
