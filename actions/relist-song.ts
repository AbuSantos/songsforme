"use server";

import { db } from "@/lib/db";
import { listedNFT } from "./listNFT";

export const relistSong = async (
  seller: string,
  tokenId: string,
  price: string,
  nftAddress: string,
  boughtNFTId: string,
  singleId?: string
) => {
  // Ensure all required fields are provided
  if (!seller || !tokenId || !price || !nftAddress || !boughtNFTId) {
    return { message: "Invalid input. All fields are required." };
  }

  try {
    // Find the bought NFT by its ID
    const boughtNFT = await db.buyNFT.findUnique({
      where: {
        id: boughtNFTId,
      },
    });

    // If no bought NFT is found, return an error message
    if (!boughtNFT) {
      return { message: "No NFT found for the provided ID." };
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return { message: "Invalid price format." };
    }

    await listedNFT(seller, tokenId, parsedPrice, nftAddress),
      await db.$transaction([
        db.buyNFT.update({
          where: { id: boughtNFTId },
          data: { relisted: true },
        }),
      ]);

    return { message: "NFT relisted successfully." };
  } catch (error) {
    // Log and return any errors that occur during the process
    console.error("Error relisting NFT:", error);
    return { message: "Error relisting NFT. Please try again later." };
  }
};
