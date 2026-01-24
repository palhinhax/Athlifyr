-- CreateEnum
CREATE TYPE "PaymentsProvider" AS ENUM ('NONE', 'STRIPE');

-- CreateEnum
CREATE TYPE "StripeOnboardingStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'COMPLETE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENT', 'FIXED');

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN "paymentsProvider" "PaymentsProvider" NOT NULL DEFAULT 'NONE',
ADD COLUMN "stripeAccountId" TEXT,
ADD COLUMN "stripeOnboardingStatus" "StripeOnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN "stripeChargesEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "stripePayoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "stripeLastWebhookAt" TIMESTAMP(3),
ADD COLUMN "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENT',
ADD COLUMN "commissionValue" INTEGER NOT NULL DEFAULT 1000;

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accountId" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_stripeAccountId_key" ON "Venue"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_stripeEventId_idx" ON "StripeWebhookEvent"("stripeEventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_accountId_idx" ON "StripeWebhookEvent"("accountId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");
