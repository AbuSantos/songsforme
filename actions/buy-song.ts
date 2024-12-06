"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { logActivity } from "./loggin-activity";

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
    const listedNFT = await db.listedNFT.findUnique({
      where: { id: listedNftId },
      select: {
        id: true,
        sold: true,
        tokenId: true,
        price: true,
        contractAddress: true,
        seller: true,
      },
    });

    if (!listedNFT) {
      return { message: "NFT not found." };
    }

    if (listedNFT.sold) {
      return { message: "NFT is already sold." };
    }

    await db.$transaction([
      db.listedNFT.update({
        where: { id: listedNftId },
        data: { sold: true },
      }),
      db.buyNFT.upsert({
        where: {
          listedNftId_tokenId: {
            listedNftId: listedNftId,
            tokenId: listedNFT?.tokenId,
          },
        },
        create: {
          buyer,
          price,
          tokenId: listedNFT?.tokenId,
          listedNftId,
          // status: "COMPLETE",
          purchaseDate: new Date(),
          ...(transactionHash && { transactionHash }),
        },
        update: {
          buyer,
          price,
          listedNftId,
          // status: "COMPLETE",
          purchaseDate: new Date(),
          ...(transactionHash && { transactionHash }),
        },
      }),
    ]);

    try {
      await logActivity(buyer, "NFT_SOLD", listedNFT.tokenId, {
        price: listedNFT.price,
        nftAddress: listedNFT.contractAddress,
        message: `You bought NFT`,
        timestamp: new Date(),
      });
    } catch (logError) {
      console.error("Error logging activity for buyer:", logError);
    }

    try {
      await logActivity(listedNFT.seller, "NFT_SOLD", listedNFT.tokenId, {
        price: listedNFT.price,
        nftAddress: listedNFT.contractAddress,
        message: `${usrname} bought your NFT`,
        timestamp: new Date(),
      });
    } catch (logError) {
      console.error("Error logging activity for seller:", logError);
    }

    revalidateTag("bought");
    revalidateTag("nft");

    return { message: "NFT bought successfully." };
  } catch (error) {
    console.error("Error buying NFT:", error);
    return { message: "Error buying NFT. Please try again later." };
  }
};
