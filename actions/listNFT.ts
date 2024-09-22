"use server";

import { db } from "@/lib/db";

const ADDRESS = "0x12ccb2398E10EbBAD1E490857d891741039CE2B5";

export const listedNFT = async (
  seller: string,
  tokenId: string,
  price: string
) => {
  try {
    db.listedNFT.create({
      data: {
        tokenId: parseInt(tokenId),
        seller: seller,
        price: parseFloat(price),
        contractAddress: ADDRESS,
        listedAt: new Date(),
        sold: false,
      },
    });

    return { message: "NFT LISTED" };
  } catch (error) {
    console.error("Error saving nft", error);
    return { message: "Error saving nft" };
  }
};
