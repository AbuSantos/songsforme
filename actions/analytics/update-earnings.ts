"use server";

import { db } from "@/lib/db";

export const updateEarnings = async (
  singleId: string | null,
  listedNftId: string | null
) => {
  if (!singleId || !listedNftId) {
    throw new Error("Details not provided");
  }
  try {

    // Fetch the single with listed NFTs and the owner
    const single = await db.single.findUnique({
      where: { id: singleId },
      select: {
        listedNft: {
          select: {
            id: true,
            price: true,
            isRelisted: true,
          },
        },
        owner: true,
      },
    });

    // Handle case where 'single' or 'owner' is not found
    if (!single || !single.owner) {
      console.log("Single or owner not found.");
      return;
    }

    const nftPrice = single?.listedNft?.find(
      (entry) => entry.id === listedNftId
    );

    if (!nftPrice) {
      console.log("NFT price not found.");
      return;
    }

    // Calculate the amount
    const amount = nftPrice.isRelisted
      ? nftPrice.price * 0.2 // Royalty for relisted NFTs (2%)
      : nftPrice.price;

    // Update ArtisteAnalytics: Accumulate the earnings
    await db.artisteAnalytics.update({
      where: {
        userId: single.owner.toLowerCase(), // Ensure consistent casing
      },
      data: {
        totalEarnings: {
          increment: amount, // Accumulate earnings
        },
      },
    });

    console.log("Earnings updated successfully.");
  } catch (error: any) {
    console.error("Error updating earnings:", error.message);
  }
};
