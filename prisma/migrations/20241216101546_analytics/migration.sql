-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "releases" INTEGER,
ADD COLUMN     "socialLinks" JSONB;

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followedId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisteAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFans" JSONB,
    "totalTracks" INTEGER NOT NULL DEFAULT 0,
    "totalReleases" JSONB,
    "totalStreams" JSONB,
    "totalLikes" JSONB,
    "earningsFromStreams" DOUBLE PRECISION,
    "earningsFromSales" JSONB,
    "earningsFromRoyalties" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtisteAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackAnalytics" (
    "id" TEXT NOT NULL,
    "listednftId" TEXT NOT NULL,
    "streams" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "uniqueListeners" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrackAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followedId_key" ON "Follow"("followerId", "followedId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisteAnalytics_userId_key" ON "ArtisteAnalytics"("userId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisteAnalytics" ADD CONSTRAINT "ArtisteAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackAnalytics" ADD CONSTRAINT "TrackAnalytics_listednftId_fkey" FOREIGN KEY ("listednftId") REFERENCES "ListedNFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
