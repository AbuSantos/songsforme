"use server";

import { db } from "@/lib/db";
import { MakeBidParams } from "@/types";
import { Knock } from "@knocklabs/node";

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
  if (!nftId || !nftAddress || !bidder || !bidAmount) {
    return { message: "Invalid Bid Details" };
  }

  const knock = new Knock(process.env.KNOCK_API_SECRET);

  try {
    //@ts-ignore
    const parsedBidAmount = parseFloat(bidAmount);

    if (isNaN(parsedBidAmount)) {
      throw new Error("Invalid bid amount: Must be a valid number.");
    }

    const newBid = await db.bid.upsert({
      where: {
        userId_tokenId: { userId, tokenId },
      },
      update: {
        bidAmount,
        transactionHash,
        status: "PENDING",
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

    // await knock.workflows.trigger("bullchord", {
    //   data: { userId: userId, bidAmount, transactionHash },
    //   recipients: [
    //     {
    //       seller,
    //     },
    //   ],
    // });



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
