"use server";

import { db } from "@/lib/db";
import { MakeBidParams } from "@/types";

// Use the type in the function
export const MakeBidBackend = async ({
  tokenId,
  nftAddress,
  nftId,
  bidder,
  bidAmount,
  transactionHash,
  userId,
}: MakeBidParams) => {
  console.log(
    tokenId,
    nftAddress,
    nftId,
    bidder,
    bidAmount,
    transactionHash,
    userId
  );

  if (!nftId || !nftAddress || !bidder || !bidAmount) {
    return { message: "Invalid Bid Details" };
  }

  try {
    //@ts-ignore
    const parsedBidAmount = parseFloat(bidAmount);

    if (isNaN(parsedBidAmount)) {
      throw new Error("Invalid bid amount: Must be a valid number.");
    }

    const newBid = await db.bid.upsert({
      where: {
        userId_tokenId: { userId, tokenId }, // Compound unique key
      },
      update: {
        bidAmount,
        transactionHash,
      },
      create: {
        userId,
        tokenId,
        nftAddress,
        nftId,
        bidder,
        bidAmount: parsedBidAmount,
        transactionHash,
      },
    });
    return {
      message: "Bid successfully placed or updated",
      success: true,
      bid: newBid,
    };
  } catch (error: any) {
    console.error("Error during upsert operation:", error);
    return {
      message: "Failed to save bid",
      success: false,
      error: error.message,
    };
  }
};
