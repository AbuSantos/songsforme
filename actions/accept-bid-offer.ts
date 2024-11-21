"use server";

import { db } from "@/lib/db";
export const acceptOffer = async (bidId: string) => {
  console.log(bidId, "bid id ");
  if (!bidId) {
    return { mesage: "Invalid Details" };
  }
  try {
    await db.bid.update({
      where: { id: bidId },
      data: { status: "WIN" },
    });

    return {
      message: "Offer accepted successfully",
    };
  } catch (error) {
    console.error("Error accepting offer:", error);
    return {
      message: "Error accepting offer",
    };
  }
};
