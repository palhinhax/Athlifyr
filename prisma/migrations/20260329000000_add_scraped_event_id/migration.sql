-- AlterTable: add scraping tracking fields to Event
ALTER TABLE "Event" ADD COLUMN "scrapedEventId" TEXT;
ALTER TABLE "Event" ADD COLUMN "lastImportedBy" TEXT;
ALTER TABLE "Event" ADD COLUMN "lastImportedAt" TIMESTAMP(3);

-- CreateIndex: unique constraint on scrapedEventId
CREATE UNIQUE INDEX "Event_scrapedEventId_key" ON "Event"("scrapedEventId");
