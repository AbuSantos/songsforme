"use server";
import { db } from "@/lib/db"; // Import the db instance
import { revalidateTag } from "next/cache";
// Function to create a playlist and optionally add a single NFT

export const createSingleSong = async (
  userId: string,
  name: string,
  songname: string,
  nftId?: string
) => {
  console.log(userId, name, songname);
  try {
    if (!userId || !songname) {
      return { message: "Single and UserId are required" };
    }

    const newSingle = await db.single.create({
      data: {
        artist_name: name,
        owner: userId,
        song_name: songname,
        ...(nftId && {
          listednft: {
            connect: { id: nftId },
          },
        }),
      },

      include: {
        listedNft: true,
      },
    });
    revalidateTag("single");
    return { message: `${newSingle.song_name}  Created ` };
  } catch (error) {
    console.log(error);
    return { message: "Error creating single" };
  }
};
