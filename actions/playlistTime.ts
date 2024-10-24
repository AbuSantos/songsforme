"use server";
import { db } from "@/lib/db"; // Ensure correct import of Prisma client

// Update the accumulated time for the specific NFT in the NFTListeningTime table with locking
export const playListTime = async (user: any, listeningDuration: number) => {
  // Validate inputs
  if (!user || listeningDuration <= 0 ) {
    throw new Error("Invalid input parameters.");
  }
  const nft = await db.listedNFT.findUnique({
    where: { id: user.currentNftId },
  });
  if (!nft) throw new Error(`NFT with id ${user.currentNftId} not found.`);

  const playlist = db.playlist.findUnique({
    where: {
      id: user.playlistId,
    },
  });

  if (!playlist) throw new Error(`NFT with id ${user.playlistId} not found.`);

  const nftRewardRatio = nft.rewardRatio || 0.2;
  //@ts-ignore
  const playlistRewardRatio = playlist.rewardRatio || 0.1;

  const ownerListeningTime = Math.round(listeningDuration * nftRewardRatio); // Owner's share
  const playlisterTime = Math.round(listeningDuration * playlistRewardRatio); // Owner's share
  const listenerListeningTime =
    listeningDuration - (nftRewardRatio + playlistRewardRatio); // Listener's share

  try {
    // Start a transaction to ensure row-level consistency
    if (listeningDuration < 30) {
      await db.user.update({
        where: { id: user.id },
        data: {
          listeningSessionStartTime: null,
          currentNftId: null,
        },
      });
    } else {
      await db.$transaction([
        db.user.update({
          where: { id: user.id },
          data: {
            accumulatedTime: { increment: listenerListeningTime },
            listeningSessionStartTime: null,
            currentNftId: null,
            playlistId: null,
          },
        }),
        db.listedNFT.update({
          where: { id: user.currentNftId },
          data: {
            accumulatedTime: { increment: ownerListeningTime },
            totalAccumulatedTime: { increment: listeningDuration },
          },
        }),
        db.playlist.update({
          where: { id: user.playlistId },
          data: {
            accumulatedTime: {
              increment: playlisterTime,
            },
          },
        }),
      ]);
    }

    return "Listening time tracked successfully.";
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }
};
