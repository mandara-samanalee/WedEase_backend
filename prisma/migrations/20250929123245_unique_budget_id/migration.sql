/*
  Warnings:

  - A unique constraint covering the columns `[categoryName,budgetId]` on the table `BudgetCategory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `budgetId` on table `BudgetCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."BudgetCategory" DROP CONSTRAINT "BudgetCategory_budgetId_fkey";

-- DropIndex
DROP INDEX "public"."BudgetCategory_categoryName_key";

-- AlterTable
ALTER TABLE "public"."BudgetCategory" ALTER COLUMN "budgetId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BudgetCategory_categoryName_budgetId_key" ON "public"."BudgetCategory"("categoryName", "budgetId");

-- AddForeignKey
ALTER TABLE "public"."BudgetCategory" ADD CONSTRAINT "BudgetCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
