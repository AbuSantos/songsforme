"use server";

import { db } from "@/lib/db";

// import { ThirdwebSDK } from "@thirdweb-dev/sdk";
// import { client } from "@/lib/client";
// import { getContract } from "thirdweb";
// import { bscTestnet, sepolia } from "thirdweb/chains";
// import { useSendTransaction } from "thirdweb/react";
const ADDRESS = "0x12ccb2398E10EbBAD1E490857d891741039CE2B5";

// const contract = getContract({
//     client,
//     chain: bscTestnet,
//   });

// const _nftAddress = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30"
// const _tokenId= 1
// const _price = 500000000000000

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
