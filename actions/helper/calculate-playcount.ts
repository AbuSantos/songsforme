import { db } from "@/lib/db";
import { LastPlayEntry, ListedNFT, User } from "@/types";

export const calculateRecentPlays = async (
  user: User,
  nft: ListedNFT,
) => {
  const now = new Date();
  const recentPlays = nft.recentPlays || [];

  // Check if the last entry in recentPlays is from today
  const lastPlayEntry = recentPlays[recentPlays.length - 1];
  const today = now.toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  if (lastPlayEntry && lastPlayEntry.timestamp.startsWith(today)) {
    // If today's entry exists, increment the count
    lastPlayEntry.count += 1;
  } else {
    // Otherwise, add a new entry for today
    recentPlays.push({ timestamp: now.toISOString(), count: 1 });
  }

  await db.listedNFT.update({
    where: { id: user.currentNftId as string },
    data: {
      recentPlays: recentPlays, // Store updated recentPlays array
      lastPlayTimestamp: now, // Update the last play timestamp
    },
  });
};
