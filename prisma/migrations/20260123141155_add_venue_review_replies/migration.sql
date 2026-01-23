-- CreateTable
CREATE TABLE "VenueReviewReply" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueReviewReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueReviewReply_reviewId_idx" ON "VenueReviewReply"("reviewId");

-- CreateIndex
CREATE INDEX "VenueReviewReply_userId_idx" ON "VenueReviewReply"("userId");

-- CreateIndex
CREATE INDEX "VenueReviewReply_createdAt_idx" ON "VenueReviewReply"("createdAt");

-- AddForeignKey
ALTER TABLE "VenueReviewReply" ADD CONSTRAINT "VenueReviewReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "VenueReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReviewReply" ADD CONSTRAINT "VenueReviewReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
