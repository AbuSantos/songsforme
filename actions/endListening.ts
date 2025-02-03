"use server";
import { db } from "@/lib/db";
import { trackListeningTime } from "./helper/tracklistening-time";
import { playListTime } from "./playlistTime";
import { revalidateTag } from "next/cache";
import { calculateRecentPlays } from "./helper/calculate-playcount";
import { ListedNFT, User } from "@/types";
import { calculateReward } from "./helper/calculate-reward";
// import { calculateReward } from "../helper/calculate-reward";

/**
 * Ends the current active listening session for a user and updates both the user and the NFT's accumulated time atomically.
 * @param {string} userId - The ID of the user ending the session.
 */

export const endListening = async (
  userId?: string,
  playlistId?: string,
  lowVolume?: string
) => {
  const startOverallTime = Date.now(); // Start overall timer
  try {
    console.log(`[START] Ending listening session for user: ${userId}`);
    if (lowVolume === "true") {
      console.log(
        `[END] Listening session ended for user: ${userId} in ${Date.now() - startOverallTime}ms`
      );
      return { message: "Volume too low" };
    }

    const userStartTime = Date.now(); // Start user query timer

    const user = await db.user.findUnique({
      where: { userId },
      select: {
        id: true,
        currentNftId: true,
        listeningSessionStartTime: true,
      },
    });

    console.log(`[DB Query] User fetch time: ${Date.now() - userStartTime}ms`);

    if (!user) throw new Error("User not found.");

    if (!user.listeningSessionStartTime || !user.currentNftId) {
      return { message: "play on" };
    }

    // Step 2: Calculate the listening duration
    const startTime = new Date(user.listeningSessionStartTime);
    const endTime = new Date();
    const listeningDuration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000 // Duration in seconds
    );

    if (listeningDuration <= 0) {
      throw new Error("Listening duration is too short to calculate.");
    }

    if (playlistId) {
      //@ts-ignore
      await playListTime(user, listeningDuration);
    } else {
      // Step 3: Fetch the NFT details (including rewardRatio)
      const nftStartTime = Date.now(); // Start NFT query timer
      const nft = await db.listedNFT.findUnique({
        where: { id: user.currentNftId },
        select: {
          rewardRatio: true,
          recentPlays: true,
          Single: {
            select: {
              owner: true,
            },
          },
        },
      });
      console.log(`[DB Query] NFT fetch time: ${Date.now() - nftStartTime}ms`);

      if (!nft) throw new Error(`NFT with id ${user.currentNftId} not found.`);

      const { listenerListeningTime, ownerListeningTime } =
        await calculateReward(listeningDuration, nft.rewardRatio || 0.2);
      console.log(
        `Owner Time: ${ownerListeningTime}, Listener Time: ${listenerListeningTime}, Total Duration: ${listeningDuration}`
      );

      // Step 4: Perform the updates using a Prisma transaction
      const transactionStartTime = Date.now(); // Start transaction timer

      if (listeningDuration < 30) {
        await db.$transaction([
          db.user.update({
            where: { userId: userId },
            data: {
              listeningSessionStartTime: null,
              currentNftId: null,
            },
          }),
        ]);
      } else {
        await trackListeningTime(user.id, user.currentNftId);
        //@ts-ignore
        await calculateRecentPlays(user, nft);
        await db.$transaction([
          db.user.update({
            where: { userId: userId },
            data: {
              accumulatedTime: { increment: listenerListeningTime },
              listeningSessionStartTime: null,
              currentNftId: null,
            },
          }),
          db.listedNFT.update({
            where: { id: user.currentNftId },
            data: {
              accumulatedTime: { increment: ownerListeningTime },
              totalAccumulatedTime: { increment: listeningDuration },
            },
          }),
        ]);
      }

      console.log(
        `[DB Transaction] Total transaction time: ${
          Date.now() - transactionStartTime
        }ms`
      );
    }

    // Move tracking outside transaction

    console.log(
      `[END] Listening session ended for user: ${userId} in ${
        Date.now() - startOverallTime
      }ms`
    );
    revalidateTag("track");
    return {
      message: "Listening session ended and times updated successfully.",
    };
  } catch (error: any) {
    console.error(
      `[ERROR] Ending listening session for user: ${userId} - ${error.message}`
    );
    throw new Error(error.message || "Failed to end the listening session.");
  }
};
