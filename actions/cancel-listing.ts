"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const cancelListing = async (
  id: string,
  userId: string,
  boughtNFTId: string,
  price: number
) => {
  if (!id || !userId) {
    return { success: false, message: "Invalid ID or User ID provided!" };
  }

  try {
    // Update the NFT record
    await db.listedNFT.update({
      where: { id },
      data: { sold: true, isRelisted: false, email: null, price },
    });

    await db.buyNFT.update({
      where: { id: boughtNFTId },
      data: {
        status: "NONE",
      },
    });

    revalidateTag("nft");

    return { success: true, message: "NFT canceled successfully!" };
  } catch (error: any) {
    console.error("Error canceling NFT:", error);
    return {
      success: false,
      message: "An error occurred while canceling the NFT.",
    };
  }
};
