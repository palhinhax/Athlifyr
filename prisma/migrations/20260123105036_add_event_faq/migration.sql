-- CreateTable
CREATE TABLE "EventFAQ" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFAQTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFAQTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventFAQ_eventId_idx" ON "EventFAQ"("eventId");

-- CreateIndex
CREATE INDEX "EventFAQ_order_idx" ON "EventFAQ"("order");

-- CreateIndex
CREATE INDEX "EventFAQTranslation_faqId_idx" ON "EventFAQTranslation"("faqId");

-- CreateIndex
CREATE INDEX "EventFAQTranslation_language_idx" ON "EventFAQTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "EventFAQTranslation_faqId_language_key" ON "EventFAQTranslation"("faqId", "language");

-- AddForeignKey
ALTER TABLE "EventFAQ" ADD CONSTRAINT "EventFAQ_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFAQTranslation" ADD CONSTRAINT "EventFAQTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "EventFAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;
