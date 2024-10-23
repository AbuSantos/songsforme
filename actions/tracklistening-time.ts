"use server";
import { db } from "@/lib/db"; // Ensure correct import of Prisma client

// Update the accumulated time for the specific NFT in the NFTListeningTime table with locking
export const trackListeningTime = async (
  userId: string,
  nftId: string,
  listeningDuration: number
) => {
  // Validate inputs
  if (!userId || !nftId || listeningDuration <= 0) {
    throw new Error("Invalid input parameters.");
  }

  try {
    // Start a transaction to ensure row-level consistency
    await db.$transaction(async (transaction) => {
      // Step 1: Check if the record exists
      const existingRecord = await transaction.nFTListeningTime.findFirst({
        where: {
          nftId: nftId,
          userId: userId,
        },
      });

      console.log("Existing record found:", existingRecord);

      if (existingRecord) {
        // Step 2: Update the existing record's accumulated time
        await transaction.nFTListeningTime.update({
          where: { id: existingRecord.id },
          data: {
            accumulatedTime: {
              increment: listeningDuration,
            },
          },
        });
        console.log("Updated existing record with incremented time.");
      } else {
        // Step 3: If no record exists, create a new one
        await transaction.nFTListeningTime.create({
          data: {
            nftId,
            userId,
            accumulatedTime: listeningDuration,
          },
        });
        console.log("Created new record for user and NFT.");
      }
    });

    return "Listening time tracked successfully.";
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }
};
