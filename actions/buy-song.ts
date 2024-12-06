"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { mutate } from "swr";
import { logActivity } from "./loggin-activity";

/**
 * Buys an NFT listed in the marketplace.
 * @param buyer - Address of the buyer.
 * @param price - Price of the NFT.
 * @param listedNftId - ID of the listed NFT.
 * @param usrname - Username of the buyer.
 * @param transactionHash - Optional transaction hash for the purchase.
 * @returns A message indicating the result of the purchase.
 */
export const buyNFT = async (
  buyer: string,
  price: number,
  listedNftId: string,
  transactionHash: string,
  usrname: string
): Promise<{ message: string }> => {
  if (!buyer || !price || !listedNftId) {
    return { message: "Invalid input. All fields are required." };
  }
  console.log(usrname, "username");

  try {
    // Fetch the listed NFT
    const listedNFT = await db.listedNFT.findUnique({
      where: { id: listedNftId },
    });

    if (!listedNFT) {
      return { message: "NFT not found." };
    }

    if (listedNFT.sold) {
      return { message: "NFT is already sold." };
    }

    // Perform atomic operations
    await db.$transaction(async (prisma) => {
      await prisma.listedNFT.update({
        where: { id: listedNftId },
        data: { sold: true },
      });

      await prisma.buyNFT.create({
        data: {
          buyer,
          price,
          listedNftId,
          status: "COMPLETE",
          purchaseDate: new Date(),
          ...(transactionHash && { transactionHash }),
        },
      });

      await logActivity(buyer, "NFT_SOLD", listedNFT.tokenId, {
        price: listedNFT.price,
        nftAddress: listedNFT.contractAddress,
        message: `You bought NFT`,
        timestamp: new Date(),
      });

      await logActivity(listedNFT.seller, "NFT_SOLD", listedNFT.tokenId, {
        price: listedNFT.price,
        nftAddress: listedNFT.contractAddress,
        message: `${usrname} bought your NFT`,
        timestamp: new Date(),
      });
    });

    // Refresh SWR data and cache
    // mutate("bought");
    // mutate("nft");
    revalidateTag("bought");
    revalidateTag("nft");

    return { message: "NFT bought successfully." };
  } catch (error) {
    console.error("Error buying NFT:", error);
    return { message: "Error buying NFT. Please try again later." };
  }
};
