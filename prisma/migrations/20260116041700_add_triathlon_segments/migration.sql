-- CreateEnum
CREATE TYPE "TriathlonSegmentType" AS ENUM ('SWIM', 'BIKE', 'RUN');

-- CreateEnum
CREATE TYPE "TriathlonTerrainType" AS ENUM ('POOL', 'OPEN_WATER', 'ROAD', 'TRAIL', 'MIXED');

-- CreateTable
CREATE TABLE "TriathlonSegment" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "segmentType" "TriathlonSegmentType" NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "terrainType" "TriathlonTerrainType" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TriathlonSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TriathlonSegment_variantId_idx" ON "TriathlonSegment"("variantId");

-- CreateIndex
CREATE INDEX "TriathlonSegment_order_idx" ON "TriathlonSegment"("order");

-- AddForeignKey
ALTER TABLE "TriathlonSegment" ADD CONSTRAINT "TriathlonSegment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
