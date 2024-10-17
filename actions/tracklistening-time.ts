"use server";

import { db } from "@/lib/db";

// Update the accumulated time for the specific NFT in the NFTListeningTime table
export const trackListeningTime = async (
  userId: string,
  nftId: string,
  listeningDuration: number
) => {
  // Validate inputs
  if (!userId || !nftId || !listeningDuration || listeningDuration <= 0) {
    throw new Error("Invalid input parameters.");
  }

  try {
    // Check if the user has an existing record for this NFT
    const existingRecord = await db.nFTListeningTime.findUnique({
      where: { nftId_userId: { nftId, userId } }, // Unique compound index
    });

    console.log(existingRecord, "existing recoed from tracking");

    if (existingRecord) {
      // Increment the accumulated time
      await db.nFTListeningTime.update({
        where: { id: existingRecord.id },
        data: { accumulatedTime: { increment: listeningDuration } },
      });
      return "Updated existing record";
    } else {
      // Create a new record if this is the first time listening to this NFT
      await db.nFTListeningTime.create({
        data: {
          nftId,
          userId,
          accumulatedTime: listeningDuration,
        },
      });
      return "Created new record";
    }
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time.");
  }
};
