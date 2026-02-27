-- AlterTable: Add teamSize column to EventVariant (default 1 = individual)
ALTER TABLE "EventVariant" ADD COLUMN "teamSize" INTEGER NOT NULL DEFAULT 1;

-- CreateTable: RegistrationTeamMember (extra team members beyond the registrant)
CREATE TABLE "RegistrationTeamMember" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "citizenId" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistrationTeamMember_registrationId_idx" ON "RegistrationTeamMember"("registrationId");

-- AddForeignKey
ALTER TABLE "RegistrationTeamMember" ADD CONSTRAINT "RegistrationTeamMember_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
