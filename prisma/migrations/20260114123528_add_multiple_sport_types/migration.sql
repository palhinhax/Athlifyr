/*
  Warnings:

  - You are about to drop the column `sportType` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Event_sportType_idx";

-- AlterTable
-- PASSO 1: Adicionar nova coluna sportTypes (array)
ALTER TABLE "Event" ADD COLUMN "sportTypes" "SportType"[];

-- PASSO 2: Copiar dados de sportType para sportTypes (converter para array)
UPDATE "Event" SET "sportTypes" = ARRAY["sportType"::text]::"SportType"[] WHERE "sportType" IS NOT NULL;

-- PASSO 3: Remover coluna antiga sportType
ALTER TABLE "Event" DROP COLUMN "sportType";

-- PASSO 4: Adicionar registrationDeadline
ALTER TABLE "Event" ADD COLUMN "registrationDeadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EventVariant" ADD COLUMN     "atrpGrade" INTEGER,
ADD COLUMN     "cutoffTimeHours" DOUBLE PRECISION,
ADD COLUMN     "elevationGainM" INTEGER,
ADD COLUMN     "elevationLossM" INTEGER,
ADD COLUMN     "itraPoints" INTEGER,
ADD COLUMN     "mountainLevel" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteSports" "SportType"[];

-- CreateTable
CREATE TABLE "PricingPhase" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "variantId" TEXT,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPercent" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPhase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricingPhase_eventId_idx" ON "PricingPhase"("eventId");

-- CreateIndex
CREATE INDEX "PricingPhase_variantId_idx" ON "PricingPhase"("variantId");

-- CreateIndex
CREATE INDEX "PricingPhase_startDate_idx" ON "PricingPhase"("startDate");

-- CreateIndex
CREATE INDEX "Event_sportTypes_idx" ON "Event"("sportTypes");

-- AddForeignKey
ALTER TABLE "PricingPhase" ADD CONSTRAINT "PricingPhase_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPhase" ADD CONSTRAINT "PricingPhase_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
