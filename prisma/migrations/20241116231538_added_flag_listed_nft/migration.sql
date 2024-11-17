-- AlterTable
ALTER TABLE "BuyNFT" ADD COLUMN     "isSaleEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ListedNFT" ADD COLUMN     "isForSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRelisted" BOOLEAN NOT NULL DEFAULT false;
