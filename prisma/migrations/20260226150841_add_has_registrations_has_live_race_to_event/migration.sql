-- CreateEnum
CREATE TYPE "AdminNoteType" AS ENUM ('EVENT', 'VENUE', 'OTHER');

-- CreateEnum
CREATE TYPE "AthliMessageRole" AS ENUM ('user', 'assistant', 'system');

-- AlterTable
ALTER TABLE "EventInvite" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventOrganizer" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventStaffMember" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AdminNoteType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "location" TEXT,
    "date" TEXT,
    "sportType" TEXT,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthliConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AthliConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthliMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AthliMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthliMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformKnowledge" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'pt',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminNote_userId_idx" ON "AdminNote"("userId");

-- CreateIndex
CREATE INDEX "AdminNote_status_idx" ON "AdminNote"("status");

-- CreateIndex
CREATE INDEX "AdminNote_type_idx" ON "AdminNote"("type");

-- CreateIndex
CREATE INDEX "AdminNote_createdAt_idx" ON "AdminNote"("createdAt");

-- CreateIndex
CREATE INDEX "AthliConversation_userId_idx" ON "AthliConversation"("userId");

-- CreateIndex
CREATE INDEX "AthliConversation_createdAt_idx" ON "AthliConversation"("createdAt");

-- CreateIndex
CREATE INDEX "AthliMessage_conversationId_idx" ON "AthliMessage"("conversationId");

-- CreateIndex
CREATE INDEX "AthliMessage_createdAt_idx" ON "AthliMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformKnowledge_slug_key" ON "PlatformKnowledge"("slug");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_category_idx" ON "PlatformKnowledge"("category");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_language_idx" ON "PlatformKnowledge"("language");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_isActive_idx" ON "PlatformKnowledge"("isActive");

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthliConversation" ADD CONSTRAINT "AthliConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthliMessage" ADD CONSTRAINT "AthliMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AthliConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
