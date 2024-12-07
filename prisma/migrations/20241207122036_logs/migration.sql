/*
  Warnings:

  - A unique constraint covering the columns `[listedNftId,tokenId]` on the table `BuyNFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `BuyNFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'PLAYLIST_CREATED';

-- DropIndex
DROP INDEX "BuyNFT_listedNftId_buyer_key";

-- AlterTable
ALTER TABLE "BuyNFT" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BuyNFT_listedNftId_tokenId_key" ON "BuyNFT"("listedNftId", "tokenId");
