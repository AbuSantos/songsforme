"use server";

import { db } from "@/lib/db";

type ReleaseCount = {
  timestamp: string; // ISO date (YYYY-MM-DD)
  count: number;
}[];

export const updateReleaseCount = async (artisteId: string) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Fetch the existing record for the user
    const existingAnalytics = await db.artisteAnalytics.findUnique({
      where: { userId: artisteId.toLowerCase() },
      select: {
        totalReleases: true,
        totalTracks: true,
      },
    });

    // Prepare updated release count
    let updatedReleases: ReleaseCount = [];

    if (existingAnalytics?.totalReleases) {
      // Parse existing totalReleases
      const currentReleaseCount = existingAnalytics.totalReleases as ReleaseCount;

      const todayEntry = currentReleaseCount.find(
        (entry) => entry.timestamp === today
      );

      if (todayEntry) {
        // Increment today's count
        todayEntry.count += 1;
      } else {
        // Add a new entry for today
        currentReleaseCount.push({ timestamp: today, count: 1 });
      }

      updatedReleases = currentReleaseCount;
    } else {
      // Initialize the releases with today's count
      updatedReleases = [{ timestamp: today, count: 1 }];
    }

    // Use upsert to update or create the analytics record
    await db.artisteAnalytics.upsert({
      where: { userId: artisteId.toLowerCase() },
      update: {
        totalReleases: updatedReleases,
        totalTracks: { increment: 1 }, // Increment total tracks by 1
      },
      create: {
        userId: artisteId.toLowerCase(),
        totalReleases: updatedReleases,
        totalTracks: 1,
      },
    });

    return { message: "Release count updated successfully.", status: 200 };
  } catch (error: any) {
    console.error("Error updating release count:", error);
    return { message: error.message || "An error occurred.", status: 500 };
  }
};
