-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED', 'NONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyNFT" (
    "id" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "listedNftId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionHash" TEXT,
    "status" "PurchaseStatus" DEFAULT 'NONE',

    CONSTRAINT "BuyNFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListedNFT" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "uri" TEXT,
    "listedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "singleId" TEXT,

    CONSTRAINT "ListedNFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Single" (
    "id" TEXT NOT NULL,
    "song_name" TEXT,
    "artist_name" TEXT,
    "song_cover" TEXT,
    "album_name" TEXT,
    "uri" TEXT,
    "owner" TEXT NOT NULL,
    "contractAddress" TEXT,
    "tokenId" TEXT,
    "listednftId" TEXT,

    CONSTRAINT "Single_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistListedNFT" (
    "playlistId" TEXT NOT NULL,
    "listedNFTId" TEXT NOT NULL,

    CONSTRAINT "PlaylistListedNFT_pkey" PRIMARY KEY ("playlistId","listedNFTId")
);

-- CreateTable
CREATE TABLE "_ListedNFTToPlaylist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ListedNFTToPlaylist_AB_unique" ON "_ListedNFTToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_ListedNFTToPlaylist_B_index" ON "_ListedNFTToPlaylist"("B");

-- AddForeignKey
ALTER TABLE "BuyNFT" ADD CONSTRAINT "BuyNFT_listedNftId_fkey" FOREIGN KEY ("listedNftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListedNFT" ADD CONSTRAINT "ListedNFT_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistListedNFT" ADD CONSTRAINT "PlaylistListedNFT_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistListedNFT" ADD CONSTRAINT "PlaylistListedNFT_listedNFTId_fkey" FOREIGN KEY ("listedNFTId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListedNFTToPlaylist" ADD CONSTRAINT "_ListedNFTToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "ListedNFT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListedNFTToPlaylist" ADD CONSTRAINT "_ListedNFTToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
