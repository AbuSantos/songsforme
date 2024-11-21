"use server";

import { db } from "@/lib/db";

export const acceptOffer = async (bidId: string, nftId: string) => {
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
    // Check if the NFT exists and if it's already sold
    const listedNFT = await db.listedNFT.findUnique({
      where: { id: nftId },
    });

    if (!listedNFT) {
      return { message: "NFT not found." };
    }

    const { tokenId, nftAddress } = acceptedBid;

    await db.$transaction(async (prisma) => {
      // Accept the selected bid
      const newBidder = await prisma.bid.update({
        where: { id: bidId },
        data: { status: "WIN" },
      });

      // Reject all other bids for the same tokenId and nftAddress
      await prisma.bid.updateMany({
        where: {
          tokenId,
          nftAddress,
          status: "PENDING",
          NOT: { id: bidId },
        },
        data: { status: "REJECTED" },
      });

      // Mark the NFT as sold
      await prisma.listedNFT.update({
        where: { id: nftId },
        data: { sold: true },
      });

      // Create a new purchase record
      await prisma.buyNFT.create({
        data: {
          buyer: newBidder?.bidder,
          price: newBidder?.bidAmount,
          listedNftId: nftId,

          purchaseDate: new Date(),
          ...(newBidder?.transactionHash && {
            transactionHash: newBidder?.transactionHash,
          }),
        },
      });
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
