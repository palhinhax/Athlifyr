-- AlterTable: Replace singular winningTicketNumber with array winningTicketNumbers
-- Step 1: Add new array column
ALTER TABLE "Giveaway" ADD COLUMN "winningTicketNumbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- Step 2: Migrate existing data (copy single value into array)
UPDATE "Giveaway"
SET "winningTicketNumbers" = ARRAY["winningTicketNumber"]
WHERE "winningTicketNumber" IS NOT NULL;

-- Step 3: Drop old singular column
ALTER TABLE "Giveaway" DROP COLUMN "winningTicketNumber";
