/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `WeddingChecklist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `WeddingChecklist` table. All the data in the column will be lost.
  - You are about to drop the column `task` on the `WeddingChecklist` table. All the data in the column will be lost.
  - Added the required column `taskTitle` to the `WeddingChecklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WeddingEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WeddingChecklist" DROP COLUMN "assignedTo",
DROP COLUMN "status",
DROP COLUMN "task",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "taskTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."WeddingEvent" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."ChecklistSubtask" (
    "id" SERIAL NOT NULL,
    "checklistId" INTEGER NOT NULL,
    "subtask" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "assignedTo" TEXT,
    "bucket" TEXT NOT NULL DEFAULT '6m',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistSubtask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ChecklistSubtask" ADD CONSTRAINT "ChecklistSubtask_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "public"."WeddingChecklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
