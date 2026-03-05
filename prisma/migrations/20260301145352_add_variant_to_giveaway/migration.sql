-- Migration: add variantId to Giveaway
ALTER TABLE "Giveaway" ADD COLUMN IF NOT EXISTS "variantId" TEXT;
CREATE INDEX IF NOT EXISTS "Giveaway_variantId_idx" ON "Giveaway"("variantId");
ALTER TABLE "Giveaway" ADD CONSTRAINT "Giveaway_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
