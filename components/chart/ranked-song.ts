"use server";

import { db } from "@/lib/db";
import { ListedNFT } from "@/types";

type PriceDatType = {
  timestamp: string; // Assuming ISO string from DB
  price: number;
};

export const rankedSong = async (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;

  //@ts-ignore
  const listedData: ListedNFT[] = await db.listedNFT.findMany({
    select: {
      id: true,
      tokenId: true,
      Single: {
        select: {
          artist_name: true,
          song_name: true,
          id: true,
        },
      },
      price: true,
      contractAddress: true,
      priceData: true,
      accumulatedTime: true, // Include this for filtering
    },
    take: limit,
    skip: offset,
  });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayStart = new Date(today);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  // Filter songs with sufficient play time
  
  //CHANGE THE PLAYED TIME TO 8000
  const highPlayedSongs = listedData.filter(
    (song) =>
      song?.accumulatedTime !== null &&
      song?.accumulatedTime !== undefined &&
      song.accumulatedTime >= 8000
  );
  if (highPlayedSongs.length === 0) {
    return [];
  }

  // Process songs/filtered songs
  const processedSongs = highPlayedSongs.map((song) => {
    if (!song?.priceData || song.priceData.length === 0) {
      return { ...song, topPrice: 0 };
    }

    const allPrices = song.priceData
      .flat()
      .filter(
        (entry: PriceDatType) =>
          new Date(entry.timestamp) >= todayStart &&
          new Date(entry.timestamp) < tomorrowStart
      )
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
