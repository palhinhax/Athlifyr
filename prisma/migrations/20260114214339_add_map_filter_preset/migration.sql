-- CreateTable
CREATE TABLE "MapFilterPreset" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "filters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapFilterPreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MapFilterPreset_userId_key" ON "MapFilterPreset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MapFilterPreset_deviceId_key" ON "MapFilterPreset"("deviceId");

-- CreateIndex
CREATE INDEX "MapFilterPreset_userId_idx" ON "MapFilterPreset"("userId");

-- CreateIndex
CREATE INDEX "MapFilterPreset_deviceId_idx" ON "MapFilterPreset"("deviceId");
