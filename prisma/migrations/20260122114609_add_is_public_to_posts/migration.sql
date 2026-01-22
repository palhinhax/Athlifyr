-- AlterEnum
ALTER TYPE "SportType" ADD VALUE 'WALKING';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Post_isPublic_idx" ON "Post"("isPublic");
