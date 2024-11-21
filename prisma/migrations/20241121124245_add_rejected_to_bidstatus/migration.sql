-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('REJECTED', 'PENDING', 'WIN');

-- DropIndex
DROP INDEX "Favorites_nftId_key";

-- DropIndex
DROP INDEX "Favorites_userId_key";

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "nftAddress" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "bidder" TEXT NOT NULL,
    "bidAmount" DOUBLE PRECISION NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bid_id_nftAddress_idx" ON "Bid"("id", "nftAddress");

-- CreateIndex
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");

-- CreateIndex
CREATE INDEX "Bid_tokenId_idx" ON "Bid"("tokenId");

-- CreateIndex
CREATE INDEX "Bid_nftAddress_idx" ON "Bid"("nftAddress");

-- CreateIndex
CREATE INDEX "Bid_createdAt_idx" ON "Bid"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_userId_tokenId_key" ON "Bid"("userId", "tokenId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
