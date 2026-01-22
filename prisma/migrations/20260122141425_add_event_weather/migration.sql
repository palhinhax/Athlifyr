-- CreateTable
CREATE TABLE "EventWeather" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER,
    "windSpeed" DOUBLE PRECISION,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventWeather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventWeather_eventId_idx" ON "EventWeather"("eventId");

-- CreateIndex
CREATE INDEX "EventWeather_date_idx" ON "EventWeather"("date");

-- CreateIndex
CREATE UNIQUE INDEX "EventWeather_eventId_date_key" ON "EventWeather"("eventId", "date");

-- AddForeignKey
ALTER TABLE "EventWeather" ADD CONSTRAINT "EventWeather_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
