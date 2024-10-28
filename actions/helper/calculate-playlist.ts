"use server";
import { db } from "@/lib/db";

const calculateDecayRate = () => Math.log(2) / 172800; // Half-life decay over 2 days

/**
 * Calculates a decayed unique playlist count based on recent additions.
 * @param {string} playlistId - The ID of the playlist.
 * @returns {number} Decayed unique count for the playlist.
 */
export const calculateDecayedPlaylistCount = async (playlistId: string) => {
  // Fetch up to the last 7 recent additions
  try {
    const playlistRecords = await db.playlist.findMany({
      where: { id: playlistId },
      select: {
        listednft: { select: { id: true } },
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 7,
    });

    const currentTime = Date.now() / 1000; // Current time in seconds
    const decayRate = calculateDecayRate();

    // Calculate the decayed playlist count
    const decayedPlaylistCount = playlistRecords.reduce((total, record) => {
      const timeAdded = new Date(record.updatedAt).getTime() / 1000;
      const timeSinceAdded = currentTime - timeAdded;
      const nftCount = record.listednft.length;
      const decayedCount = nftCount * Math.exp(-decayRate * timeSinceAdded);

      return total + decayedCount;
    }, 0);

    return decayedPlaylistCount;
  } catch (error) {
    console.error("Error tracking listening time:", error);
    throw new Error("Failed to track listening time due to concurrency.");
  }


  
};
