-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED', 'NONE');

-- CreateEnum
CREATE TYPE "isSaleEnabled" AS ENUM ('false', 'true');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "userId" TEXT NOT NULL,
    "listenTimeThreshold" INTEGER NOT NULL,
    "accumulatedTime" INTEGER NOT NULL DEFAULT 0,
    "lastListeningTime" TIMESTAMP(3),
    "listeningSessionStartTime" TIMESTAMP(3),
    "currentNftId" TEXT,
    "playlistId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTListeningTime" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accumulatedTime" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listenerIds" TEXT[],
    "listenerCount" INTEGER NOT NULL,

    CONSTRAINT "NFTListeningTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniqueListener" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listenerIds" TEXT[],
    "listenerCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UniqueListener_pkey" PRIMARY KEY ("id")
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
    "accumulatedTime" INTEGER DEFAULT 0,
    "rewardRatio" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "playlistRewardRatio" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "totalAccumulatedTime" INTEGER DEFAULT 0,
    "recentPlays" JSONB,
    "lastPlayTimestamp" TIMESTAMP(3),
    "priceData" JSONB,
    "isSaleEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ListedNFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeningSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nftId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "nftIds" TEXT[],
    "accumulatedTime" INTEGER DEFAULT 0,
    "rewardRatio" DOUBLE PRECISION DEFAULT 0.2,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "cover" TEXT,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
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
    "relisted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BuyNFT_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE INDEX "nft_date_id" ON "NFTListeningTime"("nftId", "date", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NFTListeningTime_nftId_userId_date_key" ON "NFTListeningTime"("nftId", "userId", "date");

-- CreateIndex
CREATE INDEX "nft_date_idx" ON "UniqueListener"("nftId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UniqueListener_nftId_date_key" ON "UniqueListener"("nftId", "date");

-- CreateIndex
CREATE INDEX "ListedNFT_id_idx" ON "ListedNFT"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ListedNFT_tokenId_contractAddress_key" ON "ListedNFT"("tokenId", "contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistListedNFT_listedNFTId_key" ON "PlaylistListedNFT"("listedNFTId");

-- CreateIndex
CREATE UNIQUE INDEX "_ListedNFTToPlaylist_AB_unique" ON "_ListedNFTToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_ListedNFTToPlaylist_B_index" ON "_ListedNFTToPlaylist"("B");

-- AddForeignKey
ALTER TABLE "NFTListeningTime" ADD CONSTRAINT "NFTListeningTime_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTListeningTime" ADD CONSTRAINT "NFTListeningTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniqueListener" ADD CONSTRAINT "UniqueListener_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListedNFT" ADD CONSTRAINT "ListedNFT_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningSession" ADD CONSTRAINT "ListeningSession_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "ListedNFT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyNFT" ADD CONSTRAINT "BuyNFT_listedNftId_fkey" FOREIGN KEY ("listedNftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistListedNFT" ADD CONSTRAINT "PlaylistListedNFT_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistListedNFT" ADD CONSTRAINT "PlaylistListedNFT_listedNFTId_fkey" FOREIGN KEY ("listedNFTId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListedNFTToPlaylist" ADD CONSTRAINT "_ListedNFTToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "ListedNFT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListedNFTToPlaylist" ADD CONSTRAINT "_ListedNFTToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
