/*
  Warnings:

  - The primary key for the `Otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `otpId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Otp` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_pkey",
DROP COLUMN "otpId",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Otp_pkey" PRIMARY KEY ("id");
