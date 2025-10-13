/*
  Warnings:

  - You are about to drop the column `weddingEventId` on the `customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."customer_weddingEventId_key";

-- AlterTable
ALTER TABLE "public"."customer" DROP COLUMN "weddingEventId";
