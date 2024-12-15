"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const unFollowArtiste = async (
  userId: string | undefined,
  artisteId: string
) => {
  if (!userId) {
    return { message: "Please connect your wallet!", status: 400 };
  }

  try {
    // Validate that both the follower and the followed user exist
    const follower = await db.user.findUnique({ where: { userId } });
    const followed = await db.user.findUnique({ where: { userId: artisteId } });

    if (!follower || !followed) {
      return {
        message: "One or both users do not exist.",
        status: 404,
      };
    }

    // Check if the user is already following the artiste
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followedId: { followerId: userId, followedId: artisteId },
      },
    });

    if (!existingFollow) {
      return {
        message: `You're not following ${followed?.username}, would you like to follow?`,
        status: 409,
      };
    }

    // Delete the follow record
    await db.follow.delete({
      where: {
        followerId_followedId: { followerId: userId, followedId: artisteId },
      },
    });

    // Revalidate any associated caches
    revalidateTag(`followed_${artisteId}`);

    return {
      message: `You successfully unfollowed ${followed.username}!`,
      status: 200,
    };
  } catch (error) {
    console.error("Error unfollowing artiste:", error);
    return {
      message: `An error occurred while unfollowing.`,
      status: 500,
    };
  }
};
