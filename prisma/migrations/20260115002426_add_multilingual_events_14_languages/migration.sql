-- CreateEnum
CREATE TYPE "Language" AS ENUM ('pt', 'en', 'es', 'fr', 'de', 'hi', 'bn', 'zh', 'ru', 'ja', 'ar', 'id', 'it', 'uk');

-- CreateTable
CREATE TABLE "EventTranslation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVariantTranslation" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventVariantTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventTranslation_eventId_idx" ON "EventTranslation"("eventId");

-- CreateIndex
CREATE INDEX "EventTranslation_language_idx" ON "EventTranslation"("language");

-- CreateIndex
CREATE INDEX "EventTranslation_title_idx" ON "EventTranslation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "EventTranslation_eventId_language_key" ON "EventTranslation"("eventId", "language");

-- CreateIndex
CREATE INDEX "EventVariantTranslation_variantId_idx" ON "EventVariantTranslation"("variantId");

-- CreateIndex
CREATE INDEX "EventVariantTranslation_language_idx" ON "EventVariantTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "EventVariantTranslation_variantId_language_key" ON "EventVariantTranslation"("variantId", "language");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- AddForeignKey
ALTER TABLE "EventTranslation" ADD CONSTRAINT "EventTranslation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVariantTranslation" ADD CONSTRAINT "EventVariantTranslation_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
