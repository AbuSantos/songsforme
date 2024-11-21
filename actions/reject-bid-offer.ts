"use server";

import { db } from "@/lib/db";

export const rejectOffer = async (bidId: string) => {
  if (!bidId) {
    return { mesage: "Invalid Details" };
  }
  try {
    const bid = await db.bid.update({
      where: { id: bidId },
      data: { status: "REJECTED" },
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
