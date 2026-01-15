-- CreateTable
CREATE TABLE "MapPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "zoom" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousMapPreferences" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "zoom" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousMapPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MapPreferences_userId_key" ON "MapPreferences"("userId");

-- CreateIndex
CREATE INDEX "MapPreferences_userId_idx" ON "MapPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousMapPreferences_anonymousId_key" ON "AnonymousMapPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousMapPreferences_anonymousId_idx" ON "AnonymousMapPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousMapPreferences_lastAccessedAt_idx" ON "AnonymousMapPreferences"("lastAccessedAt");

-- AddForeignKey
ALTER TABLE "MapPreferences" ADD CONSTRAINT "MapPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
