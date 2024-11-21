"use server";

import { db } from "@/lib/db";

export const acceptOffer = async (bidId: string) => {
  if (!bidId) {
    return { success: false, message: "Invalid or missing bid ID" };
  }

  try {
    // Retrieve the accepted bid to identify related bids
    const acceptedBid = await db.bid.findUnique({
      where: { id: bidId },
    });

    if (!acceptedBid) {
      return { success: false, message: "Bid not found" };
    }

    const { tokenId, nftAddress } = acceptedBid;

    // Accept the selected bid
    await db.bid.update({
      where: { id: bidId },
      data: { status: "WIN" },
    });

    // Reject all other bids for the same tokenId and nftAddress
    await db.bid.updateMany({
      where: {
        tokenId,
        nftAddress,
        status: "PENDING",
        NOT: { id: bidId },
      },
      data: { status: "REJECTED" },
    });

    return {
      success: true,
      message: "Offer accepted successfully!",
    };
  } catch (error) {
    console.error("Error accepting offer:", { bidId, error });

    return {
      success: false,
      message: "Error accepting offer. Please try again later.",
    };
  }
};
