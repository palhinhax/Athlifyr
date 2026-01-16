-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'GBP', 'USD', 'CHF');

-- AlterTable
ALTER TABLE "EventVariant" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "PricingPhase" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';
