-- CreateTable
CREATE TABLE "VenueRecommendation" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenueRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueRecommendation_venueId_idx" ON "VenueRecommendation"("venueId");

-- CreateIndex
CREATE INDEX "VenueRecommendation_userId_idx" ON "VenueRecommendation"("userId");

-- CreateIndex
CREATE INDEX "VenueRecommendation_createdAt_idx" ON "VenueRecommendation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VenueRecommendation_venueId_userId_key" ON "VenueRecommendation"("venueId", "userId");

-- AddForeignKey
ALTER TABLE "VenueRecommendation" ADD CONSTRAINT "VenueRecommendation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRecommendation" ADD CONSTRAINT "VenueRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
