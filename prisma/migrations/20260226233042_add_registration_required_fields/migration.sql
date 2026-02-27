-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "requiredRegistrationFields" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "citizenId" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "nationality" TEXT;
