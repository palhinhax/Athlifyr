-- CreateEnum
CREATE TYPE "GiveawayStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'DRAWING', 'DRAWN', 'CANCELLED');

-- CreateTable
CREATE TABLE "Giveaway" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "GiveawayStatus" NOT NULL DEFAULT 'DRAFT',
    "drawAt" TIMESTAMP(3),
    "prizeCount" INTEGER NOT NULL DEFAULT 1,
    "maxWinnersPerUser" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayTranslation" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiveawayTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayParticipation" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayWinner" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayWinner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Giveaway_eventId_idx" ON "Giveaway"("eventId");

-- CreateIndex
CREATE INDEX "Giveaway_status_idx" ON "Giveaway"("status");

-- CreateIndex
CREATE INDEX "Giveaway_drawAt_idx" ON "Giveaway"("drawAt");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayTranslation_giveawayId_lang_key" ON "GiveawayTranslation"("giveawayId", "lang");

-- CreateIndex
CREATE INDEX "GiveawayTranslation_giveawayId_idx" ON "GiveawayTranslation"("giveawayId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayParticipation_giveawayId_userId_key" ON "GiveawayParticipation"("giveawayId", "userId");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_giveawayId_idx" ON "GiveawayParticipation"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_userId_idx" ON "GiveawayParticipation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayWinner_giveawayId_userId_key" ON "GiveawayWinner"("giveawayId", "userId");

-- CreateIndex
CREATE INDEX "GiveawayWinner_giveawayId_idx" ON "GiveawayWinner"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayWinner_userId_idx" ON "GiveawayWinner"("userId");

-- AddForeignKey
ALTER TABLE "Giveaway" ADD CONSTRAINT "Giveaway_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayTranslation" ADD CONSTRAINT "GiveawayTranslation_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayParticipation" ADD CONSTRAINT "GiveawayParticipation_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayParticipation" ADD CONSTRAINT "GiveawayParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
