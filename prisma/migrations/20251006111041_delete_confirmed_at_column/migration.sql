/*
  Warnings:

  - You are about to drop the column `cancelledAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "cancelledAt",
DROP COLUMN "confirmedAt";

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "bookingId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
