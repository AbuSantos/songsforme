"use server";

import { db } from "@/lib/db";
export async function toggleState(
  nftId: string,
  state: string
): Promise<{ message: string }> {
  console.log("Toggling NFT sale state:", nftId, state);

  if (!nftId || typeof state !== "boolean") {
    return { message: "Invalid input or unauthorized" };
  }

  try {
    // Fetch the NFT record
    const nft = await db.listedNFT.findUnique({
      where: { id: nftId },
      select: { id: true },
    });

    if (!nft) {
      return { message: "NFT not found" };
    }

    // Update the isSaleEnabled state
    await db.listedNFT.update({
      where: { id: nftId },
      data: { isSaleEnabled: state },
    });

    return {
      message: `NFT sale state updated to ${state ? "enabled" : "disabled"}!`,
    };
  } catch (error: any) {
    console.error("Error toggling NFT sale state:", error);
    return { message: `Error: ${error.message}` };
  }
}
