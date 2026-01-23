-- CreateTable
CREATE TABLE "VenueReview" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueReview_venueId_idx" ON "VenueReview"("venueId");

-- CreateIndex
CREATE INDEX "VenueReview_userId_idx" ON "VenueReview"("userId");

-- CreateIndex
CREATE INDEX "VenueReview_createdAt_idx" ON "VenueReview"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VenueReview_venueId_userId_key" ON "VenueReview"("venueId", "userId");

-- AddForeignKey
ALTER TABLE "VenueReview" ADD CONSTRAINT "VenueReview_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReview" ADD CONSTRAINT "VenueReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
