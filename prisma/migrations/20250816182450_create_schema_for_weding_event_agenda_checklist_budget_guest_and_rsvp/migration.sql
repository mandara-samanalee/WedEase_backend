-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'WAITLISTED');

-- CreateTable
CREATE TABLE "public"."WeddingEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "GroomName" TEXT,
    "BrideName" TEXT,
    "date" TIMESTAMP(3),
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "location" TEXT,
    "Description" TEXT,
    "GuestCount" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeddingAgenda" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeddingChecklist" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "allocated" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RSVP" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "email" TEXT,
    "isInvited" BOOLEAN NOT NULL DEFAULT false,
    "responseStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WeddingAgenda" ADD CONSTRAINT "WeddingAgenda_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."WeddingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeddingChecklist" ADD CONSTRAINT "WeddingChecklist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."WeddingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."WeddingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."WeddingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
