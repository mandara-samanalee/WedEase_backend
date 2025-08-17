/*
  Warnings:

  - You are about to drop the column `time` on the `WeddingAgenda` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."WeddingAgenda" DROP COLUMN "time",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3);
