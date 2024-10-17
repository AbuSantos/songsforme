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

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.listeningSessionStartTime || !user.currentNftId) {
      throw new Error("No active session or invalid session details.");
    }

    // Step 2: Calculate the listening duration
    const startTime = new Date(user.listeningSessionStartTime);
    const endTime = new Date();
    const listeningDuration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    ); // in seconds

    // Step 3: Perform the updates using a Prisma transaction
    await db.$transaction(async (prisma) => {
      // Update user's accumulated time and clear the session info
      await prisma.user.update({
        where: { userId: userId },
        data: {
          accumulatedTime: {
            increment: listeningDuration, // Increment user's accumulated listening time
          },
          listeningSessionStartTime: null, // Clear session start time
          currentNftId: null, // Clear the current NFT being listened to
        },
      });

      // Fetch the NFT before updating to ensure it exists
      const nft = await prisma.listedNFT.findUnique({
        where: { id: user.currentNftId || undefined }, // Use the NFT ID stored in the user's record
      });

      if (!nft) {
        throw new Error(`NFT with id ${user.currentNftId} not found.`);
      }

      // Update the NFT's accumulated time
      await prisma.listedNFT.update({
        where: { id: user.currentNftId || undefined },
        data: {
          accumulatedTime: {
            increment: listeningDuration, // Increment NFT's accumulated listening time
          },
        },
      });

      // Track listening time for the NFT and user (call with necessary params)
      await trackListeningTime(userId, user.currentNftId, listeningDuration);
    });

    return {
      message: "Listening session ended and times updated successfully.",
    };
  } catch (error) {
    console.error("Error ending listening session:", error);
    throw new Error("Failed to end the listening session.");
  }
};
