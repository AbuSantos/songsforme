"use server";
import { db } from "@/lib/db"; // Ensure correct import of Prisma client
import { revalidateTag } from "next/cache";
import { trackListeningTime } from "./helper/tracklistening-time";
import { calculateRecentPlays } from "./helper/calculate-playcount";
import { ListedNFT, User } from "@/types";

// Update the accumulated time for the specific NFT in the NFTListeningTime table with locking
export const playListTime = async (user: User, listeningDuration: number) => {
  // Validate inputs
  if (!user || listeningDuration <= 0) {
    throw new Error("Invalid input parameters.");
  }
  //@ts-ignore
  const nft: ListedNFT = await db.listedNFT.findUnique({
    where: { id: user.currentNftId as string },
  });
  if (!nft) throw new Error(`NFT with id ${user.currentNftId} not found.`);

  const playlist = db.playlist.findUnique({
    where: {
      id: user.playlistId as string,
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
      await trackListeningTime(user.id, user.currentNftId as string);
      await calculateRecentPlays(user, nft);
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
          where: { id: user.currentNftId as string },
          data: {
            accumulatedTime: { increment: ownerListeningTime },
            totalAccumulatedTime: { increment: listeningDuration },
          },
        }),
        db.playlist.update({
          where: { id: user.playlistId as string },
          data: {
            accumulatedTime: {
              increment: playlisterTime,
            },
          },
        }),
      ]);
    }
    revalidateTag("track");

    return "Listening time tracked successfully.";
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }
};
