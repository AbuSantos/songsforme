"use server";
import { db } from "@/lib/db";
import { trackListeningTime } from "./tracklistening-time";
import { playListTime } from "./playlistTime";

/**
 * Ends the current active listening session for a user and updates both the user and the NFT's accumulated time atomically.
 * @param {string} userId - The ID of the user ending the session.
 */
export const endListening = async (userId: string, playlistId?: string) => {
  const startOverallTime = Date.now(); // Start overall timer
  try {
    console.log(`[START] Ending listening session for user: ${userId}`);

    const userStartTime = Date.now(); // Start user query timer

    //find user
    const user = await db.user.findUnique({ where: { userId } });
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
      await playListTime(user, listeningDuration);
    } else {
      // Step 3: Fetch the NFT details (including rewardRatio)
      const nftStartTime = Date.now(); // Start NFT query timer
      const nft = await db.listedNFT.findUnique({
        where: { id: user.currentNftId },
      });
      console.log(`[DB Query] NFT fetch time: ${Date.now() - nftStartTime}ms`);

      if (!nft) throw new Error(`NFT with id ${user.currentNftId} not found.`);

      const rewardRatio = nft.rewardRatio || 0.2;
      const ownerListeningTime = Math.floor(listeningDuration * rewardRatio); // Owner's share
      const listenerListeningTime = listeningDuration - ownerListeningTime; // Listener's share

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
    await trackListeningTime(user.id, user.currentNftId, listeningDuration);

    console.log(
      `[END] Listening session ended for user: ${userId} in ${
        Date.now() - startOverallTime
      }ms`
    );

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
