"use server";

import { db } from "@/lib/db";

type ToggleType = {
  nftId: string;
  state: boolean;
};
export async function toggleState({ nftId, state }: ToggleType) {
  if (!nftId || !state) {
    return { message: "Unauthorized" };
  }

  const nft = db.listedNFT.findUnique({
    where: {
      id: nftId,
    },
    select: {
      id: true,
    },
  });

  if (!nft) return { message: "NFT not found" };

  

  await prisma.user.update({
    where: { email: session.user.email },
    data: { isEnabled: newState },
  });

  return newState;
}
