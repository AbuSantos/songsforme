"use server";

import { db } from "@/lib/db";

const ADDRESS = "0x12ccb2398E10EbBAD1E490857d891741039CE2B5";

export const listedNFT = async (
  seller: string,
  tokenId: string,
  price: string,
  nftAddress: string
) => {
  // Ensure that required fields are not missing or malformed
  if (!seller || !tokenId || !price || !nftAddress) {
    return { message: "Invalid input. All fields are required." };
  }

  try {
    // Parse price to float to ensure it's in the correct format
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return { message: "Invalid price format." };
    }

    // Create a new record in the database for the listed NFT
    await db.listedNFT.create({
      data: {
        tokenId: tokenId,
        seller: seller,
        price: parsedPrice,
        contractAddress: nftAddress,
        listedAt: new Date(),
        sold: false,
      },
    });

    return { message: "NFT listed successfully." };
  } catch (error) {
    console.error("Error saving NFT:", error);
    return { message: "Error saving NFT. Please try again later." };
  }
};
