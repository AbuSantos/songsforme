"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const addToFavorite = async (
  userId: string | undefined,
  nftId: string
) => {
  if (!userId) {
    return { message: "Please connect your wallet!" };
  }

  if (!nftId) {
    return { message: "Please provide a valid song ID." };
  }

  try {
    // Check if the song is already in favorites
    const existingFavorite = await db.favorites.findFirst({
      where: {
        userId,
        nftId,
      },
    });

    if (existingFavorite) {
      return { message: "This song is already in your favorites." };
    }

    // Add a new favorite
    await db.favorites.create({
      data: {
        userId,
        nftId,
      },
    });

    revalidateTag("fav");
    return { message: "Song added to favorites successfully!" };
  } catch (error) {
    console.error("Error adding song to favorites:", error);
    return { message: "An error occurred while adding the song to favorites." };
  }
};
