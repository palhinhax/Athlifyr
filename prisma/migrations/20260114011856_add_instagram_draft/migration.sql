-- CreateEnum
CREATE TYPE "InstagramFormat" AS ENUM ('SQUARE', 'PORTRAIT', 'STORY');

-- CreateTable
CREATE TABLE "InstagramPostDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "format" "InstagramFormat" NOT NULL DEFAULT 'SQUARE',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramPostDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstagramPostDraft_userId_idx" ON "InstagramPostDraft"("userId");

-- CreateIndex
CREATE INDEX "InstagramPostDraft_createdAt_idx" ON "InstagramPostDraft"("createdAt");

-- AddForeignKey
ALTER TABLE "InstagramPostDraft" ADD CONSTRAINT "InstagramPostDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
