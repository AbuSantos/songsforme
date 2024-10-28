"use server";
import { db } from "@/lib/db";
import { startOfDay } from "date-fns";

export const trackListeningTime = async (userId: string, nftId: string) => {
  // Validate inputs
  if (!userId || !nftId) {
    throw new Error("Invalid input parameters.");
  }

  const today = startOfDay(new Date()); // Get the start of the current day

  try {
    // Start a transaction to ensure row-level consistency
    await db.$transaction(async (transaction) => {
      // Step 1: Fetch the existing record for the current day and nftId
      const existingRecord = await transaction.uniqueListener.findUnique({
        where: { nftId_date: { nftId, date: today } },
      });

      if (existingRecord) {
        // Update the record, adding userId only if it’s unique
        await transaction.uniqueListener.update({
          where: { nftId_date: { nftId, date: today } },
          data: {
            listenerIds: {
              set: Array.from(new Set([...existingRecord.listenerIds, userId])), // Ensures uniqueness
            },
            listenerCount: existingRecord.listenerIds.includes(userId)
              ? existingRecord.listenerCount
              : { increment: 1 }, // Only increment if userId is new
          },
        });
      } else {
        // Create a new record if no entry exists for today
        await transaction.uniqueListener.create({
          data: {
            nftId,
            date: today,
            listenerIds: [userId],
            listenerCount: 1,
          },
        });
      }
    });

    return { message: "Listener added" };
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }
};
