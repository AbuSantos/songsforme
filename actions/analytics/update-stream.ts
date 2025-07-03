"use server";

import { db } from "@/lib/db";
import { ArtisteAnalytics } from "@/types";

type Plays = {
  timestamp: string; // ISO timestamp
  count: number;
}[];

export const updateStream = async (artisteId: string) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Fetch the existing record for the user
    const existingAnalytics = await db.artisteAnalytics.findUnique({
      where: { userId: artisteId?.toLowerCase() },
    });

    let updatedStreams: Plays = [];

    if (existingAnalytics?.totalStreams) {
      // Parse the existing streams
      const currentStreams = existingAnalytics.totalStreams as Plays;

      // Check if there's an entry for today
      const todayEntry = currentStreams.find(
        (entry) => entry.timestamp === today
      );

      if (todayEntry) {
        // Update today's entry
        todayEntry.count += 1;
      } else {
        // Add a new entry for today
        currentStreams.push({ timestamp: today, count: 1 });
      }

      updatedStreams = currentStreams;
    } else {
      // If no streams exist, create the first entry
      updatedStreams = [{ timestamp: today, count: 1 }];
    }

    // Use upsert to update or create the analytics record
    await db.artisteAnalytics.upsert({
      where: { userId: artisteId?.toLowerCase() },
      update: {
        totalStreams: updatedStreams,
      },
      create: {
        userId: artisteId,
        totalStreams: updatedStreams,
      },
    });

    return { message: "Stream count updated successfully.", status: 200 };
  } catch (error: any) {
    console.error("Error updating stream count:", error);
    return { message: error.message || "An error occurred.", status: 500 };
  }
};
