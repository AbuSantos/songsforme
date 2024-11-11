"use server";

import { db } from "@/lib/db";
import { listedNFT } from "./listNFT";

/**
 * Relists an NFT on the marketplace after it has been bought.
 * @param {string} seller - The address of the NFT seller.
 * @param {string} tokenId - The token ID of the NFT.
 * @param {string} price - The price at which the NFT is being relisted.
 * @param {string} nftAddress - The contract address of the NFT.
 * @param {string} boughtNFTId - The ID of the NFT in the `buyNFT` table.
 * @returns {Promise<{ message: string }>} Response message indicating the result of the relisting.
 */
export const relistSong = async (
  seller: string,
  tokenId: string,
  price: string,
  nftAddress: string,
  boughtNFTId: string
): Promise<{ message: string }> => {
  console.log(
    `Attempting to relist NFT with tokenId: ${tokenId} by seller: ${seller}`
  );

  if (!seller || !tokenId || !price || !nftAddress || !boughtNFTId) {
    return { message: "Invalid input. All fields are required." };
  }

  try {
    // Retrieve the bought NFT record by ID
    const boughtNFT = await db.buyNFT.findUnique({
      where: { id: boughtNFTId },
    });
    if (!boughtNFT) {
      console.warn(`NFT not found with ID: ${boughtNFTId}`);
      return { message: "No NFT found for the provided ID." };
    }

    // Validate and parse price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return { message: "Invalid price format." };
    }

    // Try to list the NFT for sale
    try {
      //@ts-ignore
      await listedNFT(seller, tokenId, parsedPrice, nftAddress);
      console.log(`NFT relisted successfully with price: ${parsedPrice}`);
    } catch (listError) {
      console.error("Error in listedNFT function:", listError);
      return { message: "Error listing NFT. Please try again later." };
    }

    // Update the `relisted` status in `buyNFT` table
    await db.$transaction([
      db.buyNFT.update({
        where: { id: boughtNFTId },
        data: { relisted: true },
      }),
    ]);

    return { message: "NFT relisted successfully." };
  } catch (error) {
    console.error("Error relisting NFT:", error);
    return { message: "Error relisting NFT. Please try again later." };
  }
};
