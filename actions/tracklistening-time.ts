"use server";
import { db } from "@/lib/db"; // Ensure correct import of Prisma client

// Update the accumulated time for the specific NFT in the NFTListeningTime table
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
    console.log("Tracking listening time for user:", userId, "NFT:", nftId);

    // Check if the user has an existing record for this NFT (using findFirst with separate fields for nftId and userId)
    const existingRecord = await db.nFTListeningTime.findFirst({
      where: {
        nftId: nftId, // Filter by NFT ID
        userId: userId, // Filter by User ID
      },
    });

    console.log("Existing record found:", existingRecord);

    if (existingRecord) {
      // Increment the accumulated time if the record exists
      await db.nFTListeningTime.update({
        where: { id: existingRecord.id },
        data: {
          accumulatedTime: {
            increment: listeningDuration, // Increment the listening time
          },
        },
      });
      return "Updated existing record";
    } else {
      // Create a new record if this is the first time listening to this NFT
      await db.nFTListeningTime.create({
        data: {
          nftId,
          userId,
          accumulatedTime: listeningDuration, // Set the initial listening duration
        },
      });
      return "Created new record";
    }
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time.");
  }
};
