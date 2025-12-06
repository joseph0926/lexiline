-- CreateEnum
CREATE TYPE "DailySmokingRange" AS ENUM ('UNDER_5', 'FROM_5_10', 'FROM_10_20', 'OVER_20', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('FIRST', 'NORMAL', 'EARLY');

-- CreateEnum
CREATE TYPE "ReasonCode" AS ENUM ('STRESS', 'HABIT', 'BORED', 'SOCIAL', 'AFTER_MEAL', 'OTHER');

-- CreateEnum
CREATE TYPE "CoachingMode" AS ENUM ('NONE', 'LIGHT', 'FULL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isGuest" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "passwordHash" TEXT,
    "nickname" TEXT,
    "dailySmokingRange" "DailySmokingRange",
    "wakeUpTime" TEXT,
    "currentTargetInterval" INTEGER NOT NULL DEFAULT 60,
    "currentMotivation" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmokingRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "smokedAt" TIMESTAMP(3) NOT NULL,
    "type" "RecordType" NOT NULL,
    "reasonCode" "ReasonCode",
    "reasonText" TEXT,
    "coachingMode" "CoachingMode" NOT NULL DEFAULT 'NONE',
    "emotionNote" TEXT,
    "delayedMinutes" INTEGER NOT NULL DEFAULT 0,
    "intervalFromPrevious" INTEGER,
    "targetIntervalAtTime" INTEGER,
    "wasOnTarget" BOOLEAN,

    CONSTRAINT "SmokingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "targetInterval" INTEGER NOT NULL,
    "motivation" TEXT,
    "totalSmoked" INTEGER NOT NULL DEFAULT 0,
    "averageInterval" DOUBLE PRECISION,
    "totalDelayMinutes" INTEGER NOT NULL DEFAULT 0,
    "firstSmokeTime" TIMESTAMP(3),
    "hasDelaySuccess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isGuest_idx" ON "User"("isGuest");

-- CreateIndex
CREATE INDEX "SmokingRecord_userId_smokedAt_idx" ON "SmokingRecord"("userId", "smokedAt");

-- CreateIndex
CREATE INDEX "SmokingRecord_userId_createdAt_idx" ON "SmokingRecord"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DailySnapshot_userId_date_idx" ON "DailySnapshot"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailySnapshot_userId_date_key" ON "DailySnapshot"("userId", "date");

-- AddForeignKey
ALTER TABLE "SmokingRecord" ADD CONSTRAINT "SmokingRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySnapshot" ADD CONSTRAINT "DailySnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
