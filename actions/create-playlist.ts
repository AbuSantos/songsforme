"use server";
import { db } from "@/lib/db"; // Import the db instance
import { revalidateTag } from "next/cache";
import { logActivity } from "./loggin-activity";
// Function to create a playlist and optionally add a single NFT

export const createplaylist = async (
  userId: string,
  name: string,
  nftId?: string
) => {
  try {
    const newPlaylist = await db.playlist.create({
      data: {
        name,
        userId,
        ...(nftId && {
          listednft: {
            connect: { id: nftId },
          },
        }),
      },

      include: {
        listednft: true,
      },
    });
    try {
      const logs = await logActivity(
        userId,
        "PLAYLIST_CREATED",
        newPlaylist?.id,
        {
          playlist_name: newPlaylist?.name,
          message: `You created a playlist`,
          timestamp: new Date(),
        }
      );

      console.log(logs);
    } catch (logError) {
      console.error("Error logging activity for buyer:", logError);
    }
    revalidateTag("playlist");
    return { message: `${newPlaylist.name}  Created ` };
  } catch (error) {
    console.log(error);
    return { message: "Error creating playlist" };
  }
};
