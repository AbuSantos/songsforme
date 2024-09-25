"use server";
import { db } from "@/lib/db"; // Import the db instance
import { revalidateTag } from "next/cache";
// Function to create a playlist and optionally add a single NFT

export const createplaylist = async (
  userId: string,
  name: string,
  nftId?: string
) => {
  try {
    console.log(name);
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
    revalidateTag("playlist");
    // return { message: `${newPlaylist.name}  Created ` };
  } catch (error) {
    console.log(error);
    return { error: "Error creating playlist" };
  }
};
