"use server";

import { db } from "@/lib/db";
import { ArtisteAnalytics } from "@/types";

type PlayEntry = {
  timestamp: string; // ISO timestamp
  count: number;
};

export const updateStream = async (artisteId: string | undefined) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Fetch the current analytics for the artiste
    const streams: ArtisteAnalytics | null =
      await db.artisteAnalytics.findUnique({
        where: { userId: artisteId },
        select: { totalStreams: true },
      });

    if (!streams) {
      throw new Error("Artiste analytics not found.");
    }

    const currentStreams = (streams.totalStreams || []) as PlayEntry[];

    // Find today's entry
    let updatedStreams: PlayEntry[];

    const lastEntryIndex = currentStreams.findIndex(
      (entry) => entry.timestamp.split("T")[0] === today
    );

    if (lastEntryIndex !== -1) {
      // Update the count for today's entry
      currentStreams[lastEntryIndex].count += 1;
      updatedStreams = currentStreams;
    } else {
      // Add a new entry for today
      updatedStreams = [
        ...currentStreams,
        { timestamp: now.toISOString(), count: 1 },
      ];
    }

    // Update the database
    await db.artisteAnalytics.update({
      where: { userId: artisteId },
      data: { totalStreams: updatedStreams },
    });

    return { message: "Stream count updated successfully.", status: 200 };
  } catch (error: any) {
    console.error("Error updating stream count:", error);
    return { message: error.message || "An error occurred.", status: 500 };
  }
};
