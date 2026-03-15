-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "GiveawayPlatform" AS ENUM ('ALL', 'MOBILE', 'ANDROID', 'IOS');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterEnum (idempotent)
ALTER TYPE "PaymentIntentStatus" ADD VALUE IF NOT EXISTS 'REFUNDED';

-- AlterTable Giveaway
ALTER TABLE "Giveaway" ADD COLUMN IF NOT EXISTS "platform" "GiveawayPlatform" NOT NULL DEFAULT 'ALL';

-- AlterTable User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;

-- AlterTable UserPerformanceEntry
ALTER TABLE "UserPerformanceEntry" ADD COLUMN IF NOT EXISTS "runActivityId" TEXT;

-- AlterTable VenueSubscription
ALTER TABLE "VenueSubscription" ADD COLUMN IF NOT EXISTS "stripeCurrentPeriodEnd" TIMESTAMP(3);
ALTER TABLE "VenueSubscription" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;
ALTER TABLE "VenueSubscription" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;

-- CreateTable VenueProduct
CREATE TABLE IF NOT EXISTS "VenueProduct" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "stock" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable VenueProductPurchase
CREATE TABLE IF NOT EXISTS "VenueProductPurchase" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "VenueProductPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable RunActivity
CREATE TABLE IF NOT EXISTS "RunActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "distanceM" INTEGER NOT NULL,
    "avgPaceMinKm" DOUBLE PRECISION,
    "maxSpeedKmh" DOUBLE PRECISION,
    "elevationGainM" INTEGER NOT NULL DEFAULT 0,
    "elevationLossM" INTEGER NOT NULL DEFAULT 0,
    "track" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "VenueProduct_venueId_idx" ON "VenueProduct"("venueId");
CREATE INDEX IF NOT EXISTS "VenueProduct_isActive_idx" ON "VenueProduct"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "VenueProductPurchase_stripePaymentIntentId_key" ON "VenueProductPurchase"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "VenueProductPurchase_venueId_idx" ON "VenueProductPurchase"("venueId");
CREATE INDEX IF NOT EXISTS "VenueProductPurchase_productId_idx" ON "VenueProductPurchase"("productId");
CREATE INDEX IF NOT EXISTS "VenueProductPurchase_userId_idx" ON "VenueProductPurchase"("userId");
CREATE INDEX IF NOT EXISTS "VenueProductPurchase_status_idx" ON "VenueProductPurchase"("status");
CREATE INDEX IF NOT EXISTS "VenueProductPurchase_stripePaymentIntentId_idx" ON "VenueProductPurchase"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "RunActivity_userId_startedAt_idx" ON "RunActivity"("userId", "startedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "UserPerformanceEntry_runActivityId_key" ON "UserPerformanceEntry"("runActivityId");
CREATE UNIQUE INDEX IF NOT EXISTS "VenueSubscription_stripeSubscriptionId_key" ON "VenueSubscription"("stripeSubscriptionId");
CREATE INDEX IF NOT EXISTS "VenueSubscription_stripeSubscriptionId_idx" ON "VenueSubscription"("stripeSubscriptionId");

-- AddForeignKey (idempotent)
DO $$ BEGIN
  ALTER TABLE "VenueProduct" ADD CONSTRAINT "VenueProduct_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "VenueProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_runActivityId_fkey" FOREIGN KEY ("runActivityId") REFERENCES "RunActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "RunActivity" ADD CONSTRAINT "RunActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
