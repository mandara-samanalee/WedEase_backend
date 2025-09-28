/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_eventId_key" ON "public"."Budget"("eventId");
