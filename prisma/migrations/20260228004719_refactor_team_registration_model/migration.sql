/*
  Warnings:

  - You are about to drop the `RegistrationTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,eventId,variantId,teamMemberIndex]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "RegistrationTeamMember" DROP CONSTRAINT "RegistrationTeamMember_registrationId_fkey";

-- DropIndex
DROP INDEX "Registration_userId_eventId_variantId_key";

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "guestCitizenId" TEXT,
ADD COLUMN     "guestDateOfBirth" TIMESTAMP(3),
ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestEmergencyContactName" TEXT,
ADD COLUMN     "guestEmergencyContactPhone" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "teamGroupId" TEXT,
ADD COLUMN     "teamMemberIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamRole" "TeamRole";

-- DropTable
DROP TABLE "RegistrationTeamMember";

-- CreateIndex
CREATE INDEX "Registration_teamGroupId_idx" ON "Registration"("teamGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_eventId_variantId_teamMemberIndex_key" ON "Registration"("userId", "eventId", "variantId", "teamMemberIndex");
