-- CreateTable
CREATE TABLE "MotionAnalysisRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "label" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoB2Key" TEXT NOT NULL,
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotionAnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiftAnalysisRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "label" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoB2Key" TEXT NOT NULL,
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiftAnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MotionAnalysisRecord_localId_key" ON "MotionAnalysisRecord"("localId");

-- CreateIndex
CREATE INDEX "MotionAnalysisRecord_userId_idx" ON "MotionAnalysisRecord"("userId");

-- CreateIndex
CREATE INDEX "MotionAnalysisRecord_localId_idx" ON "MotionAnalysisRecord"("localId");

-- CreateIndex
CREATE UNIQUE INDEX "LiftAnalysisRecord_localId_key" ON "LiftAnalysisRecord"("localId");

-- CreateIndex
CREATE INDEX "LiftAnalysisRecord_userId_idx" ON "LiftAnalysisRecord"("userId");

-- CreateIndex
CREATE INDEX "LiftAnalysisRecord_localId_idx" ON "LiftAnalysisRecord"("localId");

-- AddForeignKey
ALTER TABLE "MotionAnalysisRecord" ADD CONSTRAINT "MotionAnalysisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiftAnalysisRecord" ADD CONSTRAINT "LiftAnalysisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
