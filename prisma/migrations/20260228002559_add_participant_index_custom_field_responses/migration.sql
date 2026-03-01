/*
  Warnings:

  - A unique constraint covering the columns `[customFieldId,registrationId,participantIndex]` on the table `CustomFieldResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customFieldId,participationId,participantIndex]` on the table `CustomFieldResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomFieldResponse_customFieldId_participationId_key";

-- DropIndex
DROP INDEX "CustomFieldResponse_customFieldId_registrationId_key";

-- AlterTable
ALTER TABLE "CustomFieldResponse" ADD COLUMN     "participantIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_registrationId_participan_key" ON "CustomFieldResponse"("customFieldId", "registrationId", "participantIndex");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_participationId_participa_key" ON "CustomFieldResponse"("customFieldId", "participationId", "participantIndex");
