"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const buyNFT = async (
  buyer: string,
  price: string,
  listedNftId: string,
  transactionHash?: string
) => {
  console.log(buyer, price, listedNftId);
  // Ensure that required fields are provided
  if (!buyer || !price || !listedNftId) {
    return { message: "Invalid input. All fields are required." };
  }

  try {
    // Parse price to ensure it's a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return { message: "Invalid price format." };
    }

    // Check if the NFT exists and if it's already sold
    const listedNFT = await db.listedNFT.findUnique({
      where: { id: listedNftId },
    });

    if (!listedNFT) {
      return { message: "NFT not found." };
    }

    if (listedNFT.sold) {
      return { message: "NFT is already sold." };
    }

    // Use a transaction to ensure atomicity
    await db.$transaction(async (prisma) => {
      // Mark the NFT as sold
      await prisma.listedNFT.update({
        where: { id: listedNftId },
        data: { sold: true },
      });

      // Create a new purchase record
      const listed = await prisma.buyNFT.create({
        data: {
          buyer,
          price: parsedPrice,
          listedNftId,
          purchaseDate: new Date(),
          ...(transactionHash && { transactionHash }),
        },
      });
      console.log(listed);
    });

    // Revalidate cached data
    revalidateTag("bought");
    revalidateTag("nft");

    return { message: "NFT bought successfully." };
  } catch (error) {
    console.error("Error buying NFT:", error);
    return { message: "Error buying NFT. Please try again later." };
  }
};
