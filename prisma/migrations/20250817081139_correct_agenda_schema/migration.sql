/*
  Warnings:

  - You are about to drop the column `endTime` on the `WeddingAgenda` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `WeddingAgenda` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `WeddingAgenda` table. All the data in the column will be lost.
  - Added the required column `Activity` to the `WeddingAgenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WeddingAgenda" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "title",
ADD COLUMN     "Activity" TEXT NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."WeddingChecklist" ALTER COLUMN "status" DROP NOT NULL;
