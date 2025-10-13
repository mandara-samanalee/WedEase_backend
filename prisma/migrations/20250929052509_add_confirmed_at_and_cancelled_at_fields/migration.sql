-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3);
