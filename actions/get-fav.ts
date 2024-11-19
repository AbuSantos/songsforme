"use server";

import { db } from "@/lib/db";

export const getUserFavorites = async (userId: string) => {
  if (!userId) {
    return { message: "User ID is required!", favorites: [] };
  }

  try {
    const favorites = await db.favorites.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        listednft: {
          select: {
            id: true,
            tokenId: true,
            price: true,
            seller: true,
            Single: {
              select: {
                song_cover: true,
                artist_name: true,
              },
            },
          },
        },
      },
    });

    if (favorites.length === 0) {
      return { message: "No favorites found for this user.", favorites: [] };
    }

    return { message: "Favorites fetched successfully!", favorites };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      message: "An error occurred while fetching favorites.",
      favorites: [],
    };
  }
};
