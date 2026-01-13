-- AlterTable
ALTER TABLE "EventVariant" ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "startTime" TEXT;

-- CreateIndex
CREATE INDEX "EventVariant_startDate_idx" ON "EventVariant"("startDate");
