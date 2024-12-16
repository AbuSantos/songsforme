import { db } from "@/lib/db";
import { LastPlayEntry, ListedNFT, User } from "@/types";
import { updateStream } from "../analytics/update-stream";

type plays = {
  timestamp: string; // UNIX timestamp
  count: number; // Price of the NFT at that timestamp
}[];

export const calculateRecentPlays = async (user: User, nft: ListedNFT) => {
  const now = new Date();
  const recentPlays: plays = nft.recentPlays || [];

  // Check if the last entry in recentPlays is from today
  const lastPlayEntry = recentPlays[recentPlays.length - 1];
  const today = now.toISOString().slice(0, 10);

  if (lastPlayEntry && lastPlayEntry.timestamp.startsWith(today)) {
    // If today's entry exists, increment the count
    lastPlayEntry.count += 1;
  } else {
    // Otherwise, add a new entry for today
    recentPlays.push({ timestamp: now.toISOString(), count: 1 });
  }
  await updateStream(nft?.Single?.owner);
  await db.listedNFT.update({
    where: { id: user.currentNftId as string },
    data: {
      recentPlays: recentPlays,
      lastPlayTimestamp: now,
    },
  });
};
