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

    // Use a transaction to ensure atomicity (both operations succeed or fail together)
    const result = await db.$transaction(async (prisma) => {
      // Create a new NFT listing
      const singleNft = await prisma.listedNFT.create({
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

      // If `singleId` is provided, associate the NFT with the Single entity
      if (singleId) {
        await prisma.single.update({
          where: {
            id: singleId,
          },
          data: {
            listedNft: {
              connect: { id: singleNft.id },
            },
          },
        });
      }

      return singleNft;
    });

    // Revalidate cached data
    revalidateTag("nft");

    return { message: "NFT listed successfully.", nft: result };
  } catch (error) {
    // Log and return a meaningful error message
    console.error("Error saving NFT:", error);
    return { message: "Error saving NFT. Please try again later." };
  }
};
