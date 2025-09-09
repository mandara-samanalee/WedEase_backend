/*
  Warnings:

  - A unique constraint covering the columns `[createdBy]` on the table `WeddingEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weddingEventId]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Day` to the `WeddingAgenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WeddingAgenda" ADD COLUMN     "Day" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."WeddingEvent" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."customer" ADD COLUMN     "weddingEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WeddingEvent_createdBy_key" ON "public"."WeddingEvent"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "customer_weddingEventId_key" ON "public"."customer"("weddingEventId");

-- AddForeignKey
ALTER TABLE "public"."WeddingEvent" ADD CONSTRAINT "WeddingEvent_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."customer"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
