/*
  Warnings:

  - You are about to drop the column `credit` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "credit",
ADD COLUMN     "credits" INTEGER;
