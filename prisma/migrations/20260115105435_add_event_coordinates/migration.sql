-- CreateTable
CREATE TABLE "EventsPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "searchQuery" TEXT,
    "userLat" DOUBLE PRECISION,
    "userLng" DOUBLE PRECISION,
    "locationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventsPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousEventsPreferences" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "searchQuery" TEXT,
    "userLat" DOUBLE PRECISION,
    "userLng" DOUBLE PRECISION,
    "locationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousEventsPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventsPreferences_userId_key" ON "EventsPreferences"("userId");

-- CreateIndex
CREATE INDEX "EventsPreferences_userId_idx" ON "EventsPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousEventsPreferences_anonymousId_key" ON "AnonymousEventsPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousEventsPreferences_anonymousId_idx" ON "AnonymousEventsPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousEventsPreferences_lastAccessedAt_idx" ON "AnonymousEventsPreferences"("lastAccessedAt");

-- AddForeignKey
ALTER TABLE "EventsPreferences" ADD CONSTRAINT "EventsPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
