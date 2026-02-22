-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'EVENT_NEW_POST';
ALTER TYPE "NotificationType" ADD VALUE 'EVENT_POST_COMMENT';

-- AlterTable
ALTER TABLE "Giveaway" ADD COLUMN     "secret" TEXT;

-- CreateTable
CREATE TABLE "AiAnalysisUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysisUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiAnalysisUsage_userId_createdAt_idx" ON "AiAnalysisUsage"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "AiAnalysisUsage" ADD CONSTRAINT "AiAnalysisUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
