/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `PaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_stripePaymentIntentId_key" ON "PaymentIntent"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "PaymentIntent_stripePaymentIntentId_idx" ON "PaymentIntent"("stripePaymentIntentId");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "VenuePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
