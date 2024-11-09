"use server";

import { db } from "@/lib/db";

type SavePriceParams = {
  priceData: RecentPrice;
  trackId: string;
};

type RecentPriceEntry = {
  timestamp: string; // UNIX timestamp as a string
  price: number;
};

type RecentPrice = RecentPriceEntry[];

export const savePrice = async (priceData: RecentPrice, trackId: string) => {
  console.log(trackId, "from save price");
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
    const today = now.toISOString().slice(0, 10);

    // Check if there's already an entry for today
    const lastPriceEntry =
      recentPrice.length > 0 ? recentPrice[recentPrice.length - 1] : null;

    if (lastPriceEntry && lastPriceEntry.timestamp?.startsWith(today)) {
      // Update the existing entry for today
      lastPriceEntry.price = priceData[0].price;
      console.log("Price already updated for the day");
    } else {
      // Add a new entry for today
      recentPrice.push({
        timestamp: now.toISOString(), // Store current timestamp in ISO format
        price: priceData[0].price,
      });
      console.log("Added new price entry for today.");
    }

    // Update with new price data
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
