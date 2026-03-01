/*
  Warnings:

  - The required column `ticketNonce` was added to the `Registration` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- Step 1: add as nullable
ALTER TABLE "Registration" ADD COLUMN "ticketNonce" TEXT;

-- Step 2: populate existing rows with a unique cuid-like value (gen_random_uuid works fine as nonce)
UPDATE "Registration" SET "ticketNonce" = gen_random_uuid()::text WHERE "ticketNonce" IS NULL;

-- Step 3: make it NOT NULL
ALTER TABLE "Registration" ALTER COLUMN "ticketNonce" SET NOT NULL;
