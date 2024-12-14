"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const followArtiste = async (
  userId: string | undefined,
  artisteId: string
) => {
  if (!userId) {
    return { message: "Please connect your wallet!" };
  }

  try {
    // Check if the user already follows the artiste
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: artisteId,
        },
      },
    });

    if (existingFollow) {
      return { message: "You already follow this artiste!" };
    }

    // Create a new follow relationship
    await db.follow.create({
      data: {
        follower: {
          connect: {
            id: userId,
          },
        },
        followed: {
          connect: {
            id: artisteId,
          },
        },
      },
    });

    // Revalidate the cache
    revalidateTag("followed");
    return { message: "You successfully followed the artiste!" };
  } catch (error) {
    console.error("Error following user:", error);
    return { message: "An error occurred while following the artiste." };
  }
};
