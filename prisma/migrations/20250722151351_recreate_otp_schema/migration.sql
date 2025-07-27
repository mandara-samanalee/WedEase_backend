/*
  Warnings:

  - The primary key for the `Otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `recipient` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
ADD COLUMN     "recipient" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD CONSTRAINT "Otp_pkey" PRIMARY KEY ("otpId");
