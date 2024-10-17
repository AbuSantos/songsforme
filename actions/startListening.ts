"use server";
import { db } from "@/lib/db";

// Start listening: Store start time and NFT ID in user's record
export const startListening = async (userId: string, nftId: string) => {
  try {
    // Step 1: Retrieve the user by their userId
    const user = await db.user.findUnique({
      where: { userId: userId },
    });

    // Step 2: Check if the user exists
    if (!user) {
      return { message: "User not found" };
    }

    // Step 3: Check if a listening session is already active
    if (user.listeningSessionStartTime) {
      return { message: "Listening session already started" };
    }

    // Step 4: Update user's start time and the NFT being listened to
    await db.user.update({
      where: { userId: userId },
      data: {
        listeningSessionStartTime: new Date(), // Record start time
        lastListeningTime: new Date(), // Update the last listening time for tracking
        currentNftId: nftId, // Store the ID of the NFT being listened to
      },
    });

    return { message: "Listening session started" };
  } catch (error) {
    console.error("Error starting listening session:", error);
    throw new Error("Failed to start listening session.");
  }
};
