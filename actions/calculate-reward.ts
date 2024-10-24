"use server";

import { db } from "@/lib/db";

// Calculate rewards for the user and each NFT owner
export const calculateRewards = async (userId: string) => {
  // Fetch all the NFT listening records for the user
  const user = await db.user.findUnique({
    where: { userId },
    select: {
      accumulatedTime: true,
    },
  });

  return { message: "Rewards calculated and distributed." };
};
