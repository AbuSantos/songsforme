/*
  Warnings:

  - A unique constraint covering the columns `[listedNftId,buyer]` on the table `BuyNFT` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('NFT_SOLD', 'BID_PLACED', 'NFT_TRANSFERRED', 'LISTING_CREATED');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_id_idx" ON "Activity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_userId_action_entityId_key" ON "Activity"("userId", "action", "entityId");

-- CreateIndex
CREATE INDEX "BuyNFT_id_idx" ON "BuyNFT"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BuyNFT_listedNftId_buyer_key" ON "BuyNFT"("listedNftId", "buyer");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
