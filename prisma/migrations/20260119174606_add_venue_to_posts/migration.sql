-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "venueId" TEXT;

-- CreateIndex
CREATE INDEX "Post_venueId_idx" ON "Post"("venueId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
