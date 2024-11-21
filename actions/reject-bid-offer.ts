"use server";

import { db } from "@/lib/db";

export const rejectOffer = async (bidId: string) => {
  if (!bidId) {
    return { success: false, message: "Invalid or missing bid ID" };
  }

  try {
    // Update the bid's status to "REJECTED"
    const bid = await db.bid.update({
      where: { id: bidId },
      data: { status: "REJECTED" },
    });

    return {
      success: true,
      message: `Offer rejected successfully.`,
      bid,
    };
  } catch (error) {
    console.error("Error rejecting offer:", { bidId, error });

    return {
      success: false,
      message: "Error rejecting offer. Please try again later.",
    };
  }
};
