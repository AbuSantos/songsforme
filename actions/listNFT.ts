"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const listedNFT = async (
  seller: string,
  tokenId: string,
  price: string,
  nftAddress: string,
  singleId?: string
) => {
  // Ensure that required fields are provided
  if (!seller || !tokenId || !price || !nftAddress) {
    return { message: "Invalid input. All fields are required." };
  }

  try {
    // Parse price to ensure it's a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return { message: "Invalid price format." };
    }

    // Create a new NFT listing in the database
    await db.listedNFT.create({
      data: {
        tokenId: tokenId,
        seller: seller,
        price: parsedPrice,
        contractAddress: nftAddress,
        listedAt: new Date(),
        sold: false,
        ...(singleId && {
          Single: {
            connect: { id: singleId },
          },
        }),
      },
    });

    revalidateTag("nft");

    return { message: "NFT listed successfully." };
  } catch (error) {
    // Log and return a meaningful error message
    console.error("Error saving NFT:", error);
    return { message: "Error saving NFT. Please try again later." };
  }
};
