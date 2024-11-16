"use server";

import { db } from "@/lib/db";

export const cancelListing = async (id: string, userId: string) => {
  if (!id || !userId) {
    return { success: false, message: "Invalid ID or User ID provided!" };
  }

  try {
    // Optional: Validate if the user exists (only needed if userId isn't authenticated upstream)
    const user = await db.user.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found!" };
    }

    // Update the NFT record
    await db.listedNFT.update({
      where: { id },
      data: { sold: false },
    });

    return { success: true, message: "NFT canceled successfully!" };
  } catch (error: any) {
    console.error("Error canceling NFT:", error);
    return { success: false, message: "An error occurred while canceling the NFT." };
  }
};
