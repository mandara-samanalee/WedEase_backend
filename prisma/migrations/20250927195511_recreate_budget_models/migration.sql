/*
  Warnings:

  - You are about to drop the column `allocated` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `spent` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "allocated",
DROP COLUMN "category",
DROP COLUMN "spent",
ADD COLUMN     "AllocatedBudget" DOUBLE PRECISION,
ADD COLUMN     "RemainingBudget" DOUBLE PRECISION,
ADD COLUMN     "SpentBudget" DOUBLE PRECISION,
ADD COLUMN     "TotalBudget" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."BudgetCategory" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "allocatedAmount" DOUBLE PRECISION,
    "spentAmount" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "budgetId" INTEGER,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BudgetCategory_categoryName_key" ON "public"."BudgetCategory"("categoryName");

-- AddForeignKey
ALTER TABLE "public"."BudgetCategory" ADD CONSTRAINT "BudgetCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
