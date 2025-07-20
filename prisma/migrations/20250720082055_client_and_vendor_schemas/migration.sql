/*
  Warnings:

  - You are about to drop the column `city_distric` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `customer` table. All the data in the column will be lost.
  - Added the required column `city` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "city_distric",
DROP COLUMN "fullName",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "fullName",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactNo" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
