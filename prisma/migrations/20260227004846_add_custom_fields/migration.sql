-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('SELECT', 'BOOLEAN');

-- CreateTable
CREATE TABLE "EventCustomField" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "CustomFieldType" NOT NULL DEFAULT 'SELECT',
    "options" TEXT[],
    "required" BOOLEAN NOT NULL DEFAULT false,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldResponse" (
    "id" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "registrationId" TEXT,
    "participationId" TEXT,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventCustomField_eventId_idx" ON "EventCustomField"("eventId");

-- CreateIndex
CREATE INDEX "EventCustomField_order_idx" ON "EventCustomField"("order");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_customFieldId_idx" ON "CustomFieldResponse"("customFieldId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_registrationId_idx" ON "CustomFieldResponse"("registrationId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_participationId_idx" ON "CustomFieldResponse"("participationId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_userId_idx" ON "CustomFieldResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_registrationId_key" ON "CustomFieldResponse"("customFieldId", "registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_participationId_key" ON "CustomFieldResponse"("customFieldId", "participationId");

-- AddForeignKey
ALTER TABLE "EventCustomField" ADD CONSTRAINT "EventCustomField_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "EventCustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
