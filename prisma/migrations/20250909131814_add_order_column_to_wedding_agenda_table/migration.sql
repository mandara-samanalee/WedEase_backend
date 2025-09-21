/*
  Warnings:

  - You are about to drop the column `Day` on the `WeddingAgenda` table. All the data in the column will be lost.
  - Added the required column `Date` to the `WeddingAgenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WeddingAgenda" DROP COLUMN "Day",
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
