"use server";
import { db } from "@/lib/db";
import { trackListeningTime } from "./tracklistening-time";

/**
 * Ends the current active listening session for a user and updates both the user and the NFT's accumulated time atomically.
 * @param {string} userId - The ID of the user ending the session.
 */
export const endListening = async (userId: string) => {
  try {
    // Step 1: Retrieve the user and ensure they have an active session
    const user = await db.user.findUnique({
      where: { userId: userId },
    });

    if (!user) throw new Error("User not found.");
    if (!user.listeningSessionStartTime || !user.currentNftId) {
      throw new Error("No active session or invalid session details.");
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

    // Step 3: Fetch the NFT details (including rewardRatio)
    const nft = await db.listedNFT.findUnique({
      where: { id: user.currentNftId },
    });

    if (!nft) throw new Error(`NFT with id ${user.currentNftId} not found.`);

    const rewardRatio = nft.rewardRatio || 0.2;
    const ownerListeningTime = Math.floor(listeningDuration * rewardRatio); // Owner's share
    const listenerListeningTime = listeningDuration - ownerListeningTime; // Listener's share

    console.log(
      `Owner Time: ${ownerListeningTime}, Listener Time: ${listenerListeningTime}, Total Duration: ${listeningDuration}`
    );

    // Step 4: Perform the updates using a Prisma transaction
    await db.$transaction(async (prisma) => {
      // Update user's accumulated time and clear the session info
      await prisma.user.update({
        where: { userId: userId },
        data: {
          accumulatedTime: { increment: listenerListeningTime },
          listeningSessionStartTime: null,
          currentNftId: null,
        },
      });

      // Update the NFT's accumulated time for the owner
      await prisma.listedNFT.update({
        where: { id: user.currentNftId || undefined },
        data: {
          accumulatedTime: { increment: ownerListeningTime },
          // Optional: If `totalAccumulatedTime` exists in schema
          totalAccumulatedTime: { increment: listeningDuration },
        },
      });

      // Track listening time for the NFT and user
      await trackListeningTime(user.id, user.currentNftId, listeningDuration);
    });

    return {
      message: "Listening session ended and times updated successfully.",
    };
  } catch (error) {
    console.error("Error ending listening session:", error);
    throw new Error("Failed to end the listening session.");
  }
};
