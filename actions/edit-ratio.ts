"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

type EditRatioType = {
  userId: string;
  trackId?: string;
  playlistId?: string;
  mode: string;
  data: number; // Corrected type to 'number'
};

export const editRatio = async ({
  userId,
  mode,
  data,
  playlistId,
  trackId,
}: EditRatioType) => {
  if (!userId) {
    throw new Error("Please connect Wallet");
  }
  try {
    const user = await db.user.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return { message: "User not found" };
    }

    if (mode === "playlist") {
      if (!playlistId) {
        throw new Error("Playlist ID is required for playlist mode");
      }

      await db.playlist.update({
        where: {
          id: playlistId,
        },
        data: {
          rewardRatio: data,
        },
      });
    } else if (mode === "track") {
      if (!trackId) {
        throw new Error("Track ID is required for track mode");
      }

      await db.listedNFT.update({
        where: {
          id: trackId,
        },
        data: {
          rewardRatio: data,
        },
      });
    } else if (mode === "track-playlist") {
      await db.listedNFT.update({
        where: {
          id: trackId,
        },
        data: {
          playlistRewardRatio: data,
        },
      });
    } else {
      throw new Error("Invalid mode specified");
    }
    revalidateTag("playlist");

    return {
      message: "Reward Ratio updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating price:", error);
    return { message: "Error updating price data.", error: error.message };
  }
};
