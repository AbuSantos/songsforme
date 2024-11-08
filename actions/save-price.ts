"use server";

import { db } from "@/lib/db";

type SavePriceParams = {
  priceData: RecentPrice;
  trackId: string;
};
type RecentPrice = {
  timestamp: string; // UNIX timestamp
  price: number; // Price of the NFT at that timestamp
}[];

export const savePrice = async ({ priceData, trackId }: SavePriceParams) => {
  if (!trackId) {
    return { message: "Song ID is required!" };
  }

  try {
    const listedNft = await db.listedNFT.findUnique({
      where: { id: trackId },
      select: { priceData: true },
    });

    if (!listedNft) {
      return { message: "Song not found!" };
    }

    const now = new Date();
    const recentPrice: RecentPrice = listedNft.priceData || [];

    // Check if the last entry in recentPrice is from today
    const lastPriceEntry = recentPrice[recentPrice.length - 1];
    const today = now.toISOString().slice(0, 10);

    if (lastPriceEntry && lastPriceEntry.timestamp.startsWith(today)) {
      lastPriceEntry.price = priceData.price;
    } else {
      recentPrice.push(priceData);
    }

    // Combine existing price data with new data to preserve historical records

    await db.listedNFT.update({
      where: { id: trackId },
      data: { priceData: recentPrice },
    });

    return { message: "Price updated successfully." };
  } catch (error) {
    console.error("Error updating price:", error);
    return { message: "Error updating price data.", error: error.message };
  }
};
