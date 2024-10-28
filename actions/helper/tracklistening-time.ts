"use server";
import { db } from "@/lib/db";
import { startOfDay } from "date-fns";

export const trackListeningTime = async (
  userId: string,
  nftId: string,
  listeningDuration: number
) => {
  // Validate inputs
  if (!userId || !nftId || listeningDuration <= 0) {
    throw new Error("Invalid input parameters.");
  }

  const today = startOfDay(new Date()); // Get the start of the current day

  try {
    // Start a transaction to ensure row-level consistency
     await db.$transaction(async (transaction) => {
      return transaction.uniqueListener.upsert({
        where: { nftId_date: { nftId, date: today } },
        update: {
          listenerIds: { push: userId },
          listenerCount: { increment: 1 },
        },
        create: {
          nftId,
          date: today,
          listenerIds: [userId],
          listenerCount: 1,
        },
      });
    });

    return { message: "listener added" };
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }
};
