"use server";

import { db } from "@/lib/db";
import { listedNFT } from "./listNFT";
import { revalidateTag } from "next/cache";
import { logActivity } from "./loggin-activity";

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

    // Upsert the NFT listing
    await db.listedNFT.upsert({
      where: {
        tokenId_contractAddress: {
          tokenId,
          contractAddress: nftAddress,
        },
      },
      update: {
        seller,
        price: parsedPrice,
        listedAt: new Date(),
        sold: false,
        isSaleEnabled: false,
        accumulatedTime: 0,
        isRelisted: true,
      },
      create: {
        seller,
        tokenId,
        contractAddress: nftAddress,
        price: parsedPrice,
        listedAt: new Date(),
        sold: false,
        isSaleEnabled: false,
        isRelisted: true,
      },
    });

    await logActivity(seller, "LISTING_CREATED", tokenId, {
      price: parsedPrice,
      nftAddress,
      message: `Relisted NFT on marketplace.`,
      timestamp: new Date(),
    });

    // Update the `relisted` status in `buyNFT` table
    await db.buyNFT.update({
      where: { id: boughtNFTId },
      data: { status: "PENDING" },
    });

    revalidateTag("bought");
    revalidateTag("nft");

    return { message: "NFT relisted successfully." };
  } catch (error) {
    console.error("Error relisting NFT:", error);
    return { message: "Error relisting NFT. Please try again later." };
  }
};
