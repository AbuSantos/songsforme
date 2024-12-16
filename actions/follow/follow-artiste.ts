"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { updateFansCount } from "../analytics/update-fans-count";

export const followArtiste = async (
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

    if (existingFollow) {
      return {
        message: `You are already following ${followed.username}`,
        status: 409,
      };
    }

    await db.follow.create({
      data: {
        follower: { connect: { userId } },
        followed: { connect: { userId: artisteId } },
      },
    });
    await updateFansCount(artisteId);

    revalidateTag(`followed_${artisteId}`);
    return {
      message: `You successfully followed ${followed.username}!`,
      status: 200,
    };
  } catch (error) {
    console.error("Error following artiste:", error);
    return {
      message: "An error occurred while following the artiste.",
      status: 500,
    };
  }
};
