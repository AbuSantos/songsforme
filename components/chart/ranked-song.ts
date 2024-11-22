"use server";

import { db } from "@/lib/db";
import { ListedNFT } from "@/types";

type PriceDatType = {
  timestamp: string; // Assuming ISO string from DB
  price: number;
};

export const rankedSong = async () => {
  //@ts-ignore
  const listedData: ListedNFT[] = await db.listedNFT.findMany({
    select: {
      id: true,
      tokenId: true,
      Single: {
        select: {
          artist_name: true,
          id: true,
        },
      },
      price: true,
      contractAddress: true,
      priceData: true,
    },
  });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Process songs
  const processedSongs = listedData.map((song) => {
    if (!song?.priceData || song.priceData.length === 0) {
      return { ...song, topPrice: 0 };
    }

    // Flatten priceData and filter for today's prices
    const allPrices = song.priceData
      .flat()
      .filter((entry: PriceDatType) => entry.timestamp.startsWith(today))
      .map((entry: PriceDatType) => entry.price);

    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
    return { ...song, topPrice: maxPrice };
  });

  // Sort songs by topPrice in descending order
  const sortedSongs = processedSongs.sort((a, b) => b.topPrice - a.topPrice);

  // Assign ranks, handling ties
  let currentRank = 0;
  let previousPrice: number | null = null;

  const rankedSongs = sortedSongs.map((song, index) => {
    if (song.topPrice !== previousPrice) {
      currentRank = index + 1; // Update rank if price is different
    }

    previousPrice = song.topPrice;

    return {
      ...song,
      rank: currentRank,
    };
  });

  return rankedSongs;
};
