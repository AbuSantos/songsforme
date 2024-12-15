"use server"

import { db } from "@/lib/db";

export const isFollowing = async (userId: string, artisteId: string) => {
    if (!userId) {
        return { message: "Please connect your wallet!", status: 400 };
    }

    try {
        const existingFollow = await db.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: userId,
                    followedId: artisteId,
                },
            },
        });

        if (existingFollow) {
            return {
                isFollowing: true,
                message: `You are following ${artisteId}.`,
                status: 200,
            };
        }

        return {
            isFollowing: false,
            message: `You are not following ${artisteId}.`,
            status: 200,
        };
    } catch (error) {
        console.error("Error checking follow status:", error);
        return {
            message: "An error occurred while checking follow status.",
            status: 500,
        };
    }
};
