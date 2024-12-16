"use server";

import { db } from "@/lib/db";
import { count, timeStamp } from "console";
type FollowerCount = {
  timestamp: string; // ISO timestamp
  count: number;
}[];
export const updateFansCount = async (artisteId: string) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Fetch the existing record for the user
    const existingAnalytics = await db.artisteAnalytics.findUnique({
      where: { userId: artisteId.toLowerCase() },
      select: {
        totalFans: true,
      },
    });

    let updatedFollows: FollowerCount = [];

    if (existingAnalytics?.totalFans) {
      const currentFollowerCount =
        existingAnalytics?.totalFans as FollowerCount;

      const todayEntry = currentFollowerCount.find(
        (entry) => entry.timestamp === today
      );

      if (todayEntry) {
        // Update today's entry
        todayEntry.count += 1;
      } else {
        currentFollowerCount.push({ timestamp: now.toISOString(), count: 1 });
      }

      updatedFollows = currentFollowerCount;
    } else {
      updatedFollows = [{ timestamp: today, count: 1 }];
    }
  } catch (error) {}
};
