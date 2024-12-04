/*
  Warnings:

  - A unique constraint covering the columns `[contractAddress]` on the table `Single` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Single" ADD COLUMN     "genre" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Single_contractAddress_key" ON "Single"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
