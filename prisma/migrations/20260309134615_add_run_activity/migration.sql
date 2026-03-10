/*
  Warnings:

  - You are about to drop the column `variantId` on the `Giveaway` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[runActivityId]` on the table `UserPerformanceEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CheckpointType" AS ENUM ('START', 'FINISH', 'INTERMEDIATE', 'TRANSITION');

-- CreateEnum
CREATE TYPE "LiveRaceVisibility" AS ENUM ('PUBLIC', 'FRIENDS', 'ORGANIZER_ONLY');

-- AlterEnum
ALTER TYPE "EventLiveStatus" ADD VALUE 'WARMUP';

-- DropForeignKey
ALTER TABLE "Giveaway" DROP CONSTRAINT "Giveaway_variantId_fkey";

-- DropIndex
DROP INDEX "Giveaway_variantId_idx";

-- AlterTable
ALTER TABLE "Giveaway" DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "liveRaceVisibility" "LiveRaceVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "UserPerformanceEntry" ADD COLUMN     "runActivityId" TEXT;

-- CreateTable
CREATE TABLE "EventRoute" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "gpxData" TEXT,
    "routePoints" JSONB NOT NULL DEFAULT '[]',
    "distanceKm" DOUBLE PRECISION,
    "elevationGainM" INTEGER,
    "elevationLossM" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteCheckpoint" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CheckpointType" NOT NULL DEFAULT 'INTERMEDIATE',
    "order" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusM" INTEGER NOT NULL DEFAULT 50,
    "cutoffMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "distanceM" INTEGER NOT NULL,
    "avgPaceMinKm" DOUBLE PRECISION,
    "maxSpeedKmh" DOUBLE PRECISION,
    "elevationGainM" INTEGER NOT NULL DEFAULT 0,
    "elevationLossM" INTEGER NOT NULL DEFAULT 0,
    "track" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventRoute_variantId_key" ON "EventRoute"("variantId");

-- CreateIndex
CREATE INDEX "EventRoute_variantId_idx" ON "EventRoute"("variantId");

-- CreateIndex
CREATE INDEX "RouteCheckpoint_routeId_idx" ON "RouteCheckpoint"("routeId");

-- CreateIndex
CREATE INDEX "RouteCheckpoint_routeId_order_idx" ON "RouteCheckpoint"("routeId", "order");

-- CreateIndex
CREATE INDEX "RunActivity_userId_startedAt_idx" ON "RunActivity"("userId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerformanceEntry_runActivityId_key" ON "UserPerformanceEntry"("runActivityId");

-- AddForeignKey
ALTER TABLE "EventRoute" ADD CONSTRAINT "EventRoute_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "EventRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_runActivityId_fkey" FOREIGN KEY ("runActivityId") REFERENCES "RunActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunActivity" ADD CONSTRAINT "RunActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
